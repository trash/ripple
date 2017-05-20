import * as _ from 'lodash';;
import {
	NDArray,
	Direction,
	XYCoordinates,
	IRandomTileOptions,
	IRowColumnCoordinates,
	TilemapData
} from '../interfaces';
import ndarray = require('ndarray');
import {floodfill} from '../vendor/flood-fill';
import {AStar as aStar} from '../vendor/astar';
import {perlin} from '../vendor/perlin';
import {constants} from '../data/constants';
import {Resource} from '../data/Resource';
import {util, Util} from '../util';
import {GameManager} from '../game/GameManager';
import {MapGenerator, IMapGenReturn} from './MapGenerator';
import {MapUtil} from './map-util';
import {MapGenTile} from './MapGenTile';
import {MapTile} from './tile';
import {events} from '../events';
import {Biome} from './Biome';


let zoneNumber = 10;
let zoneNumberCount;

export interface IMapOptions {
	gameManager: GameManager;
	noResources?: boolean;
	dimension?: number;
	seed?: number;
	noHills?: boolean;
	allLand?: boolean;
	saveData?: SerializedMapData
}

export interface IGeneratedMapData {
	baseTilemap: string[];
	upperTilemap: string[];
	resourceList: Resource[];
}

interface SerializedMapData extends IGeneratedMapData {
	dimension: number,
}

interface ClearTilesInput {
	position: XYCoordinates;
	size: {
		width: number;
		height: number;
	};
}

interface Biome {
	name: string;
	baseTile: string;
	ratios: {
		[key: string]: number
	}
}

export class GameMap {
	dimension: number;
	resourceList: Resource[];

	private biome: Biome;
	private tiles: MapTile[];
	private seed: number;
	private gameManager: GameManager;
	private edgeTiles: MapTile[];
	private onMouseMoveListener: (e: MouseEvent) => void;
	private baseTilemap: string[];
	private upperTilemap: string[];
	private _grid: number[][];
	private tileHoverListenerCallbacks: ((tile: MapTile) => void)[]
	private tileHoverListenerInterval: number;
	private hoverCoords: XYCoordinates;
	private hoverTile: MapTile;

	constructor (options: IMapOptions) {
		const gameManager = options.gameManager;
		const dimension = options.dimension;
		const seed = options.seed;
		const allLand = options.allLand;
		const saveData = options.saveData;

		this.seed = seed;

		this.gameManager = gameManager;

		// Initialize an empty list of tiles
		this.tiles = [];

		// Should be getting a biome from somewhere but right now we'll hardcode
		// it as forest
		this.biome = Biome.Forest;

		// The height/width of the grid
		this.dimension = saveData && saveData.dimension || dimension || 120;

		this.loadGeneratedMapData(saveData || this.generate(allLand, options));

		this.tileHoverListenerCallbacks = [];

		gameManager.loop.on('update', () => this.onLoopUpdate());

		this.onMouseMoveListener = (e: MouseEvent) => this._onMouseMoveListener(e);
		window.addEventListener('mousemove', this.onMouseMoveListener);
	}

	private loadGeneratedMapData (mapData: IGeneratedMapData) {
		this.baseTilemap = mapData.baseTilemap;
		this.upperTilemap = mapData.upperTilemap;
		this.resourceList = mapData.resourceList;

		// console.log(this.baseTilemap, this.upperTilemap);

		this.tiles = [];
		for (let i = 0; i < this.dimension; i++) {
			for (let j = 0; j < this.dimension; j++) {
				const index = i * this.dimension + j,
					tile = new MapTile(i, j, this.dimension,
						this.upperTilemap[index],
						this.baseTilemap[index].includes('water'));
				this.tiles.push(tile);
			}
		}
	}

	generate (allLand: boolean, options: IMapOptions): IMapGenReturn {
		const generator = new MapGenerator(
			this.dimension,
			this.seed,
			this.biome,
			allLand
		);
		return generator.generate(options.noResources);
	}

	private onLoopUpdate () {
		if (!this.hoverTile) {
			return;
		}
		this.tileHoverListenerCallbacks.forEach(callback => {
			callback(this.hoverTile);
		});
	}

	private _onMouseMoveListener (event: MouseEvent) {
		this.hoverCoords = this.positionToTile(event.x, event.y);
		this.hoverTile = this.getTile(this.hoverCoords.y, this.hoverCoords.x);
	}

	destroy () {
		window.removeEventListener('mousemove', this.onMouseMoveListener);
	}

	/**
	 * Calls the initialize method on all the tiles associated with this map
	 */
	initialize () {
		// Update the grid
		this.grid(true);
		events.emit('map-update', this);
	}

	/**
	 * Generates and returns the tilemap data for the grid of tiles associated
	 * with this map
	 *
	 * @return {Object} The tilemap data. Look at Tiled's output for an example
	 */
	getTilemap (): TilemapData {
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
		startTile: XYCoordinates,
		endTile: XYCoordinates
	): IRowColumnCoordinates[] {
		return MapUtil.getTilesBetween<IRowColumnCoordinates>(
			this.tiles,
			startTile,
			endTile
		);
	}

	/*
	* Picks and returns a random tile.
	*
	* @param {Boolean} [accessible] Whether or not the tile should be accessible
	* @param {Number} [range] The range (radius) of tiles to wander around
	* between (i.e. a square of tiles to select from)
	* @param {Tile} [basetile] If range is passed, the baseTile to search from
	*
	* @return {Tile} The random tile
	*/
	getRandomTile (options: IRandomTileOptions = {}): MapTile {
		return MapUtil.getRandomTile(this.tiles, options);
	}

	getFarthestTile (
		baseTile: IRowColumnCoordinates,
		limit: number,
		direction: Direction
	): IRowColumnCoordinates {
		return MapUtil.getFarthestTile(this.tiles, baseTile, limit, direction);
	}

	/**
	 * Takes an x, y position from the window and returns the x, y in terms of
	 * tiles on the map
	 *
	 * @param {Number} x X pixel value
	 * @param {Number} y Y pixel value
	 * @return {Object} e.g. {x: 23, y:24}
	 */
	positionToTile (x: number, y: number): XYCoordinates {
		const camera = this.gameManager.camera;

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
	 * Attaches a click listener to the canvas that passes the clicked tile to
	 * the callback function
	 * Returns a function that removes the event listener from the canvas
	 *
	 * @param {Function} callback The callback function that gets called on every click
	 *                            that gets passed the tile that got clicked
	 * @returns {Function} Removes the event listener from the canvas when called.
	 */
	addTileClickListener (
		callback: (tile: IRowColumnCoordinates | null) => void
	): () => void {
		const canvasClick = event => {
			const clickCoords = this.positionToTile(event.x, event.y);
			const clickedTile = this.getTile(clickCoords.y, clickCoords.x) || null;

			callback(clickedTile);
		};

		window.addEventListener('click', canvasClick);

		return () => window.removeEventListener('click', canvasClick);
	}

	/**
	 * Attaches a mousemove listener to the canvas that passes the currently
	 * hovered over tile to the callback func
	 * Returns a function that removes the event listener from the canvas
	 *
	 * @param {Function} callback The callback function that gets called on
	 * every tick of mousemove that gets passed the tile that is currently hovered over
	 * @returns {Function} Removes the event listener from the canvas when called.
	 */
	addTileHoverListener (
		callback: (tile: IRowColumnCoordinates) => void
	): () => void {
		this.tileHoverListenerCallbacks.push(callback);

		return () => {
			this.removeTileHoverListener(callback);
		};
	}

	removeTileHoverListener (callback: (tile: IRowColumnCoordinates) => void) {
		const index = this.tileHoverListenerCallbacks.indexOf(callback);
		this.tileHoverListenerCallbacks.splice(index, 1);
	}

	getElementPositionFromTile (
		tile: IRowColumnCoordinates
	): { left: number, top: number } {
		if (!tile) {
			console.error('Invalid tile. Your coords are probably out of '
				+ 'bounds. Cannot set element position.');
			return;
		}
		const camera = this.gameManager.camera;

		let left = 0;
		let top = 0;

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
		const {left, top} = this.getElementPositionFromTile(tile);
		element.style.left = left + 'px';
		element.style.top = top + 'px';
	}

	getSpritePositionFromTile(tile: IRowColumnCoordinates): XYCoordinates {
		return {
			x: tile.column * constants.TILE_HEIGHT,
			y: tile.row * constants.TILE_HEIGHT
		};
	}

	/**
	 * Sets the position of a sprite to that of a tile
	 *
	 * @param {PIXI.Sprite} sprite The sprite to change the position of
	 * @param {Tile} tile The tile to take the position from
	 */
	setSpriteToTilePosition (
		sprite: PIXI.DisplayObject,
		tile: IRowColumnCoordinates
	) {
		const coords = this.getSpritePositionFromTile(tile);
		sprite.x = coords.x;
		sprite.y = coords.y;
	}

	scaledTileSize (): number {
		return constants.TILE_HEIGHT * this.gameManager.camera.scale;
	}

	serialize (): SerializedMapData {
		return {
			dimension: this.dimension,
			baseTilemap: this.baseTilemap,
			upperTilemap: this.upperTilemap,
			resourceList: this.resourceList
		};
	}

	/**
	* Returns the nearest tile that passes the checkMethod function to the
	* current one.
	* Uses a spiral out algorithm.
	*
	* @param {Tile} tile The tile to start the spiralling search from.
	* @returns {Tile} The first instance of a tile that passes the checkMethod
	* from the starting tile.
	* @todo Handle edges cases. Currently if the spiral starts on the left edge
	* it has some unpredictable behavior.
	*/
	getNearestEmptyTile (
		tile: IRowColumnCoordinates,
		checkMethod: (tile: MapTile) => boolean
	): IRowColumnCoordinates {
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

	private getEdgeTiles (): MapTile[] {
		if (!this.edgeTiles) {
			let edgeNumber = this.dimension - 1;
			this.edgeTiles = this.tiles.filter(tile => {
				return tile.row === 0
					|| tile.column === 0
					|| tile.row === edgeNumber
					|| tile.column === edgeNumber;
			});
		}
		return this.edgeTiles;
	}

	/**
	 * Should return the nearest tile that can be pathed to
	 * to exit the map from the current tile.
	 * NOTE: the tile should be accessible from the start tile.
	 *
	 * @param {Tile} startTile
	 * @return {Tile}
	 */
	getNearestExitTile (
		startTile: IRowColumnCoordinates
	): IRowColumnCoordinates {
		const sortedEdgeTiles = this.getEdgeTiles()
			.filter(tile => tile.accessible)
			.sort((a, b) => a.distanceTo(startTile) - b.distanceTo(startTile));
		return sortedEdgeTiles[0];
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
		this._grid = this.getGrid();
		return this._grid;
	}

	private getGrid (ignoreAccessible: boolean = false): number[][] {
		const grid = [];
		for (let i = 0; i < this.dimension; i++) {
			grid.push([]);
			for (let j = 0; j < this.dimension; j++) {
				if (ignoreAccessible) {
					grid[i].push(constants.COLLISION_EXISTS_FALSE);
				} else {
					const tile = this.getTile(i, j);
					grid[i].push(!tile.collision
						? constants.COLLISION_EXISTS_FALSE
						: constants.COLLISION_EXISTS_TRUE
					);
				}
			}
		}
		return grid;
	}

	private bridgeGrid () {
		return this.getGrid(true);
	}

	pathExists (
		fromTile: IRowColumnCoordinates,
		toTile: IRowColumnCoordinates
	): boolean {
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
	getTile (row: number, column: number): MapTile | null {
		return MapUtil.getTile(this.tiles, row, column);
	}

	getTileByIndex (index: number): MapTile {
		return this.getTile(
			Math.floor(index / this.dimension), index % this.dimension
		);
	}

	getTileFromCoords (coords: IRowColumnCoordinates): MapTile {
		return this.getTile(coords.row, coords.column);
	}
}