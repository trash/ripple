import _ = require('lodash');
import {NDArray, Direction, ICoordinates, IRandomTileOptions} from '../interfaces';
import ndarray = require('ndarray');
import {floodfill} from '../vendor/flood-fill';
import {AStar as aStar} from '../vendor/astar';
import {perlin} from '../vendor/perlin';
import {Tile} from './tile';
import {constants} from '../data/constants';
import {util, Util} from '../util';
import {ResourceCluster} from './resource-cluster';
import {GameManager} from '../game/game-manager';
import {MapGenerator} from './map-generator';
import {MapUtil} from './map-util';
import {MapGenTile} from './map-gen-tile';

type TileCoordinates = [number, number];

var zoneNumber = 10,
	zoneNumberCount;

var waterCheckFunction = (neighbor: string): boolean => {
		if (!neighbor) {
			return true;
		}
		// Check if they're water tiles. If they're at the edge of the map (no neighbor)
		// then just act like the water continues off the map
		return neighbor.indexOf('water') !== -1 && neighbor.indexOf('bridge') === -1;
	},
	hillCheckFunction = (neighbor: Tile): boolean => neighbor && !!neighbor.hill;

export interface IMapOptions {
	gameManager: GameManager;
	noResources?: boolean;
	dimension?: number;
	seed?: number;
	hills?: any;
	noHills?: boolean;
	allLand?: boolean;
	saveData?: any
};

interface SerializedMapData {
	dimension: number,
	baseTilemap: string[],
	upperTilemap: string[],
};

interface ClearTilesInput {
	position: ICoordinates;
	size: {
		width: number;
		height: number;
	};
};

export interface PathCoordinates {
	column: number;
	row: number;
};

export class GameMap {
	seed: number;
	gameManager: GameManager;
	biome: any;
	tiles: Tile[];
	dimension: number;
	baseTilemap: string[];
	upperTilemap: string[];
	targetCursor: any;
	__edgeTiles: Tile[];
	_grid: number[];
	_tileHoverListenerCallbacks: ((tile: Tile) => void)[]
	_tileHoverListenerInterval: number;
	_hoverCoords: ICoordinates;
	_hoverTile: Tile;

	constructor (options: IMapOptions) {
		let gameManager = options.gameManager,
			dimension = options.dimension,
			seed = options.seed,
			allLand = options.allLand,
			saveData = options.saveData;

		this.seed = seed;

		this.gameManager = gameManager;

		// Initialize an empty list of tiles
		this.tiles = [];

		// Should be getting a biome from somewhere but right now we'll hardcode it as forest
		this.biome = {
			name: 'forest',
			baseTile: 'full-grass'
		};

		// The height/width of the grid
		this.dimension = saveData && saveData.dimension || dimension || 120;

		if (saveData) {
			dimension = saveData.dimension;
			this.baseTilemap = saveData.bottomTilemap;
			this.upperTilemap = saveData.tilemapData;
			this.generateTiles(this.upperTilemap, saveData.resources);
		} else {
			this.generate(allLand, options);
		}

		this._tileHoverListenerCallbacks = [];

		gameManager.loop.on('loop-update', this._onLoopUpdate.bind(this));

		this._onMouseMoveListener = this._onMouseMoveListener.bind(this);
		window.addEventListener('mousemove', this._onMouseMoveListener);
	}

	generateTiles (tileData: string[], resourcesSaveData) {
		for (var i=0; i < tileData.length; i++) {
			var tile = new Tile(this, i, {
				data: tileData[i],
				water: this.baseTilemap[i].indexOf('water') !== -1 ? true : false,
				resource: resourcesSaveData && resourcesSaveData[i]
			});

			// If water mark the neighboring land nodes as 'borderWater'
			if (tile.water) {
				var siblings = tile.getSiblings();
				siblings.forEach(function (sibling) {
					if (sibling && !sibling.water) {
						sibling.borderWater = true;
					}
				});
			}

			this.tiles.push(tile);
		}
	}

	generate (allLand: boolean, options) {
		const generator = new MapGenerator(this.dimension, this.seed, 'full-grass', allLand);
		const generated = generator.generate();

		this.baseTilemap = generated.baseTilemap;
		this.upperTilemap = generated.tilemapData;
	}

	_onLoopUpdate () {
		if (!this._hoverTile) {
			return;
		}
		this._tileHoverListenerCallbacks.forEach(callback => {
			callback(this._hoverTile);
		});
	}

	_onMouseMoveListener (event) {
		this._hoverCoords = this.positionToTile(event.x, event.y);
		this._hoverTile = this.getTile(this._hoverCoords.y, this._hoverCoords.x);
	}

	updateTilemapData () {
		this.upperTilemap = this.tiles.map(tile => tile.tilemapData);
	}

	destroy () {
		window.removeEventListener('mousemove', this._onMouseMoveListener);
	}

	/**
	 * Calls the initialize method on all the tiles associated with this map
	 */
	initializeTiles () {
		this.tiles.forEach(tile => tile.initialize());
		// Update the grid
		this.grid(true);
	}

	/**
	 * Generates and returns the tilemap data for the grid of tiles associated with this map
	 *
	 * @return {Object} The tilemap data. Look at Tiled's output for an example
	 */
	getTilemap () {
		// 12 : flat green
		// 65 : regular grass
		// 66 : tufty grass
		// 77 : tree

		return {
			version: 1,
			width: this.dimension,
			height: this.dimension,
			tilewidth: 24,
			tileheight: 24,
			tilesets: [
				{
					name: 'Forest',
					firstgid: 0,
					imageheight: 24,
					imagewidth: 24,
					tilewidth: 24,
					tileheight: 24,
					margin: 0,
					spacing: 0,
					properties: {},
					image: 'no'
				}
			],
			layers: [
				{
					name: 'Forest Layer 1',
					data: this.baseTilemap,
					width: this.dimension,
					height: this.dimension,
					opacity: 1,
					type: 'tilelayer',
					visible: true,
					x: 0,
					y: 0
				},
				{
					name: 'Forest Layer 2',
					data: this.upperTilemap,
					width: this.dimension,
					height: this.dimension,
					opacity: 1,
					type: 'tilelayer',
					visible: true,
					x: 0,
					y: 0
				}],
			orientation: 'orthogonal',
			properties: {}
		};
	}

	/*
	* Picks and returns a random tile.
	*
	* @param {Boolean} [accessible] Whether or not the tile should be accessible
	* @param {Number} [range] The range (radius) of tiles to wander around between (i.e. a square of tiles to select from)
	* @param {Tile} [basetile] If range is passed, the baseTile to search from
	*
	* @return {Tile} The random tile
	*/
	getRandomTile (options: IRandomTileOptions = {}): Tile {
		return MapUtil.getRandomTile(this.tiles, options) as Tile;
	}

	getFarthestTile (baseTile: Tile, limit: number, direction: Direction): Tile {
		return MapUtil.getFarthestTile(this.tiles, baseTile, limit, direction) as Tile;
	}

	/**
	 * Takes an x, y position from the window and returns the x, y in terms of tiles on the map
	 *
	 * @param {Number} x X pixel value
	 * @param {Number} y Y pixel value
	 * @return {Object} e.g. {x: 23, y:24}
	 */
	positionToTile (x: number, y: number): { x: number, y: number } {
		var camera = this.gameManager.camera;

		// Take into account camera offset
		x += camera.view.x;
		y += camera.view.y;

		// Take into account tile size
		x /= constants.TILE_HEIGHT;
		y /= constants.TILE_HEIGHT;

		return {
			x: Math.floor(x),
			y: Math.floor(y)
		};
	}

	/**
	 * Attaches a click listener to the canvas that passes the clicked tile to the callback function
	 * Returns a function that removes the event listener from the canvas
	 *
	 * @param {Function} callback The callback function that gets called on every click
	 *                            that gets passed the tile that got clicked
	 * @returns {Function} Removes the event listener from the canvas when called.
	 */
	addTileClickListener (callback: (event: any) => void): () => void {
		var canvasClick = event => {
			var clickCoords = this.positionToTile(event.x, event.y);
			var clickedTile = this.getTile(clickCoords.y, clickCoords.x);
			if (!clickedTile) {
				return;
			}

			callback(clickedTile);
		};

		window.addEventListener('click', canvasClick);

		return function () {
			window.removeEventListener('click', canvasClick);
		};
	}

	/**
	 * Attaches a mousemove listener to the canvas that passes the currently hovered over tile to the callback func
	 * Returns a function that removes the event listener from the canvas
	 *
	 * @param {Function} callback The callback function that gets called on every tick of mousemove
	 *                            that gets passed the tile that is currently hovered over
	 * @returns {Function} Removes the event listener from the canvas when called.
	 */
	addTileHoverListener (callback: (tile: Tile) => void): () => void {
		this._tileHoverListenerCallbacks.push(callback);

		return () => {
			this.removeTileHoverListener(callback);
		};
	}

	removeTileHoverListener (callback: (tile: Tile) => void) {
		let index = this._tileHoverListenerCallbacks.indexOf(callback);
		this._tileHoverListenerCallbacks.splice(index, 1);
	}

	getElementPositionFromTile (tile: Tile): { left: number, top: number } {
		if (!tile) {
			console.error('Invalid tile. Your coords are probably out of bounds. Cannot set element position.');
			return;
		}
		var camera = this.gameManager.camera;

		var left = 0,
			top = 0;

		// Add scaled tile position
		left += tile.column * constants.TILE_HEIGHT;
		top += tile.row * constants.TILE_HEIGHT;

		// Add camera
		left += camera.x;
		top += camera.y;

		return {
			left: left,
			top: top
		};
	}

	/**
	 * Sets an element's position on the dom to match the position of a tile
	 *
	 * @param {Element} element The element to change the position of
	 * @param {Tile} tile The tile to match the element to
	 */
	setElementToTilePosition (element: HTMLElement, tile: Tile) {
		if (!tile) {
			return;
		}
		let {left, top} = this.getElementPositionFromTile(tile);
		element.style.left = left + 'px';
		element.style.top = top + 'px';
	}

	/**
	 * Sets the position of a sprite to that of a tile
	 *
	 * @param {PIXI.Sprite} sprite The sprite to change the position of
	 * @param {Tile} tile The tile to take the position from
	 */
	setSpriteToTilePosition (sprite: any, tile: Tile) {
		sprite.x = tile.column * constants.TILE_HEIGHT;
		sprite.y = tile.row * constants.TILE_HEIGHT;
	}

	scaledTileSize (): number {
		return constants.TILE_HEIGHT * this.gameManager.camera.scale;
	}

	/**
	 * Given the biome returns a tile based on the given ratios associated with that biome
	 *
	 * @param {String} biome Biome name
	 * @return {String} The tile data corresponding to the tilemap
	 */
	getTileForBiome (biome: string): string {
		var ratios;
		if (biome === 'forest') {
			// full-grass: background
			// 1: background
			// grass: grass
			// 3: grass rock top right
			// grass3: grass rock top left
			// 5: grass multiple rocks
			// 6: grass multiple rocks 2
			// grass6: grass with mushrooms
			// 8: dirt on grass 1
			// 9: dirt on grass 2
			// 10: dirt on grass 3
			ratios = {
				'empty': 40, //effectively 'full-grass'
				// '1': 1,
				'grass': 20,
				// '3': 8,
				'grass3': 2,
				// '5': 2,
				// '6': 2,
				'grass6': 2,
				// 'water-full': 2
				// '8': 1,
				// '9': 0,
				// '10': 0,
				// 'dirt1': 2

			};
		}

		return util.randomFromRatios(ratios);
	}

	serialize (): SerializedMapData {
		let data = {
			dimension: this.dimension,
			baseTilemap: this.baseTilemap,
			upperTilemap: this.upperTilemap
		};
		return data;
	}

	/**
	* Returns the nearest tile that passes the checkMethod function to the current one.
	* Uses a spiral out algorithm.
	*
	* @param {Tile} tile The tile to start the spiralling search from.
	* @returns {Tile} The first instance of a tile that passes the checkMethod from the starting tile.
	* @todo Handle edges cases. Currently if the spiral starts on the left edge it has some unpredictable
	* 		behavior.
	*/
	getNearestEmptyTile (tile: Tile, checkMethod: (tile: Tile) => boolean): Tile {
		return MapUtil.getNearestEmptyTile(this.tiles, tile, checkMethod) as Tile;
	}

	/**
	 * Find the nearest tile from the startTile that is at
	 * the edge of the map
	 *
	 * @param {Tile} startTile
	 * @return Tile
	 */
	static getNearestEdgeTile (
		tiles: MapGenTile[],
		startTile: MapGenTile
	): MapGenTile {
		const sorted = MapUtil.getNearestEdgeTiles(tiles, startTile) as MapGenTile[];

		return sorted.filter(tile => {
			return tile.accessible;
		})[0];
	}

	/**
	 * Updates the grid (recalculates accessible values)
	 */
	updateGrid () {
		if (!this._grid) {
			return;
		}
		this.grid(true);
	}


	/**
	* Sets and returns a grid formatted for EasyStar
	*
	* @param {boolean} [skipCache] Whether or not to skip the cache
	* @returns {Array[]} A matrix representing whether tiles are valid to enter
	*/
	grid (skipCache?: boolean): number[] {
		if (this._grid && !skipCache) {
			return this._grid;
		}
		this._grid = this._getGrid();
		return this._grid;
	}

	_getGrid (accessible?: boolean): number[] {
		var grid = [];
		for (var i=0; i < this.dimension; i++) {
			grid.push([]);
			for (var j=0; j < this.dimension; j++) {
				var tile = this.getTile(i, j);
				if (!accessible) {
					grid[i].push(tile.accessible ? 0 : 1);
				} else {
					grid[i].push(0);
				}
			}
		}
		return grid;
	}

	bridgeGrid () {
		return this._getGrid(true);
	}

	pathExists (fromTile: Tile, toTile: Tile): boolean {
		return !!this.getPath(fromTile, toTile).length;
	}

	/**
	* Takes a pair of tiles and returns a callback that returns the A* path
	*
	* @param {Tile} fromTile The tile to start the path from
	* @param {Tile} toTile The tile to path to
	* @return {PathCoordinates[]}
	*/
	getPath (fromTile: Tile, toTile: Tile): PathCoordinates[] {
		return MapUtil.getPath(this.grid(), fromTile, toTile);
	}

	/**
	* Takes a row and column and returns the matching tile
	*
	* Returns false if coords are out of bounds
	*
	* @param {int} row The row of the tile
	* @param {int} column The column of the tile
	* @returns {Tile} The tile that matches these coords
	*/
	getTile (row: number, column: number): Tile {
		return MapUtil.getTile(this.tiles, row, column) as Tile;
	}
}