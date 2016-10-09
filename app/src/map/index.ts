import _ = require('lodash');
import {NDArray, Direction, ICoordinates, IRandomTileOptions, IRowColumnCoordinates, ITilemapData} from '../interfaces';
import ndarray = require('ndarray');
import {floodfill} from '../vendor/flood-fill';
import {AStar as aStar} from '../vendor/astar';
import {perlin} from '../vendor/perlin';
import {constants} from '../data/constants';
import {util, Util} from '../util';
import {GameManager} from '../game/game-manager';
import {MapGenerator, IMapGenReturn} from './map-generator';
import {MapUtil} from './map-util';
import {MapGenTile} from './map-gen-tile';
import {MapTile} from './tile';

var zoneNumber = 10,
	zoneNumberCount;

export interface IMapOptions {
	gameManager: GameManager;
	noResources?: boolean;
	dimension?: number;
	seed?: number;
	hills?: any;
	noHills?: boolean;
	allLand?: boolean;
	saveData?: SerializedMapData
}

export interface IGeneratedMapData {
	baseTilemap: string[];
	upperTilemap: string[];
	resourceList: string[];
}

interface SerializedMapData extends IGeneratedMapData {
	dimension: number,
}

interface ClearTilesInput {
	position: ICoordinates;
	size: {
		width: number;
		height: number;
	};
}

export class GameMap {
	seed: number;
	gameManager: GameManager;
	biome: any;
	tiles: MapTile[];
	dimension: number;
	baseTilemap: string[];
	upperTilemap: string[];
	resourceList: string[];
	targetCursor: any;
	_grid: number[][];
	_tileHoverListenerCallbacks: ((tile: MapTile) => void)[]
	_tileHoverListenerInterval: number;
	_hoverCoords: ICoordinates;
	_hoverTile: MapTile;

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
			baseTile: 'full-grass',
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
			ratios: {
				'empty': 40, //effectively 'full-grass'
				'grass': 20,
				// 'grass2': 8,
				'grass3': 2,
				// 'grass4': 2,
				// 'grass5': 2,
				'grass6': 2,
				// 'dirt1': 2

			}
		};

		// The height/width of the grid
		this.dimension = saveData && saveData.dimension || dimension || 120;


		if (saveData) {
			dimension = saveData.dimension;
		}
		this._loadGeneratedMapData(saveData || this.generate(allLand, options));

		this._tileHoverListenerCallbacks = [];

		gameManager.loop.on('loop-update', this._onLoopUpdate.bind(this));

		this._onMouseMoveListener = this._onMouseMoveListener.bind(this);
		window.addEventListener('mousemove', this._onMouseMoveListener);
	}

	_loadGeneratedMapData (mapData: IGeneratedMapData) {
		this.baseTilemap = mapData.baseTilemap;
		this.upperTilemap = mapData.upperTilemap;
		this.resourceList = mapData.resourceList;

		// console.log(this.baseTilemap, this.upperTilemap);

		this.tiles = [];
		for (let i=0; i < this.dimension; i++) {
			for (let j=0; j < this.dimension; j++) {
				const index = i * this.dimension + j,
					tile = new MapTile(i, j, this.dimension,
						this.upperTilemap[index],
						this.baseTilemap[index].includes('water'));
				this.tiles.push(tile);
			}
		}
	}

	generate (allLand: boolean, options): IMapGenReturn {
		const generator = new MapGenerator(this.dimension, this.seed, this.biome, allLand);
		return generator.generate();
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

	destroy () {
		window.removeEventListener('mousemove', this._onMouseMoveListener);
	}

	/**
	 * Calls the initialize method on all the tiles associated with this map
	 */
	initialize () {
		// Update the grid
		this.grid(true);
	}

	/**
	 * Generates and returns the tilemap data for the grid of tiles associated with this map
	 *
	 * @return {Object} The tilemap data. Look at Tiled's output for an example
	 */
	getTilemap (): ITilemapData {
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

	getTilesBetween (
		startTile: ICoordinates,
		endTile: ICoordinates
	): IRowColumnCoordinates[] {
		return MapUtil.getTilesBetween<IRowColumnCoordinates>(this.tiles, startTile, endTile);
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
	getRandomTile (options: IRandomTileOptions = {}): MapTile {
		return MapUtil.getRandomTile(this.tiles, options);
	}

	getFarthestTile (
		baseTile: MapTile,
		limit: number,
		direction: Direction
	): MapTile {
		return MapUtil.getFarthestTile(this.tiles, baseTile, limit, direction);
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
	addTileClickListener (callback: (tile: MapTile) => void): () => void {
		var canvasClick = event => {
			const clickCoords = this.positionToTile(event.x, event.y),
				clickedTile = this.getTile(clickCoords.y, clickCoords.x);
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
	addTileHoverListener (callback: (tile: IRowColumnCoordinates) => void): () => void {
		this._tileHoverListenerCallbacks.push(callback);

		return () => {
			this.removeTileHoverListener(callback);
		};
	}

	removeTileHoverListener (callback: (tile: IRowColumnCoordinates) => void) {
		let index = this._tileHoverListenerCallbacks.indexOf(callback);
		this._tileHoverListenerCallbacks.splice(index, 1);
	}

	getElementPositionFromTile (
		tile: IRowColumnCoordinates
	): { left: number, top: number } {
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
	setElementToTilePosition (element: HTMLElement, tile: IRowColumnCoordinates) {
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
	setSpriteToTilePosition (sprite: any, tile: IRowColumnCoordinates) {
		sprite.x = tile.column * constants.TILE_HEIGHT;
		sprite.y = tile.row * constants.TILE_HEIGHT;
	}

	scaledTileSize (): number {
		return constants.TILE_HEIGHT * this.gameManager.camera.scale;
	}

	serialize (): SerializedMapData {
		let data = {
			dimension: this.dimension,
			baseTilemap: this.baseTilemap,
			upperTilemap: this.upperTilemap,
			resourceList: this.resourceList
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
	getNearestEmptyTile (tile: MapTile, checkMethod: (tile: MapTile) => boolean): MapTile {
		return MapUtil.getNearestTile(this.tiles, tile, checkMethod);
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
		const sorted = MapUtil.getNearestEdgeTiles(tiles, startTile);

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
	grid (skipCache: boolean = false): number[][] {
		if (this._grid && !skipCache) {
			return this._grid;
		}
		this._grid = this._getGrid();
		return this._grid;
	}

	_getGrid (ignoreAccessible: boolean = false): number[][] {
		const grid = [];
		for (let i=0; i < this.dimension; i++) {
			grid.push([]);
			for (let j=0; j < this.dimension; j++) {
				if (ignoreAccessible) {
					grid[i].push(0);
				} else {
					const tile = this.getTile(i, j);
					grid[i].push(tile.accessible ? 0 : 1);
				}
			}
		}
		return grid;
	}

	bridgeGrid () {
		return this._getGrid(true);
	}

	pathExists (fromTile: IRowColumnCoordinates, toTile: IRowColumnCoordinates): boolean {
		return !!this.getPath(fromTile, toTile).length;
	}

	/**
	* Takes a pair of tiles and returns a callback that returns the A* path
	*
	* @param {Tile} fromTile The tile to start the path from
	* @param {Tile} toTile The tile to path to
	* @return {PathCoordinates[]}
	*/
	getPath (
		fromTile: IRowColumnCoordinates,
		toTile: IRowColumnCoordinates
	): IRowColumnCoordinates[] {
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
	getTile (row: number, column: number): MapTile {
		return MapUtil.getTile(this.tiles, row, column);
	}

	getTileByIndex (index: number): MapTile {
		return this.getTile(Math.floor(index / this.dimension), index % this.dimension);
	}
}