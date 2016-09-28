/**
 * map.js
 *
 * Author: Stefan Valentin
 */

import _ = require('lodash');
import {NDArray, Direction, ICoordinates} from '../interfaces';
import ndarray = require('ndarray');
import {floodfill} from '../vendor/flood-fill';
import {AStar as aStar} from '../vendor/astar';
import {perlin} from '../vendor/perlin';
import {Tile} from './tile';
import {constants} from '../data/constants';
import {util} from '../util';
import {ResourceCluster} from './resource-cluster';
import {GameManager} from '../game/game-manager';
import {MapGenerator} from './map-generator';

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

interface RandomTileOptions {
	accessible?: boolean;
	range?: number;
	baseTile?: Tile;
};

interface SerializedMapData {
	dimension: number,
	bottomTilemap: string[],
	tilemapData: string[],
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

/**
* Creates a new GameMap object.
*
* @classdesc A map made up of Tiles that is used to generate a map.
*
* @constructor
*/
export class GameMap {
	seed: number;
	gameManager: GameManager;
	biome: any;
	tiles: Tile[];
	dimension: number;
	bottomTilemap: string[];
	tilemapData: string[];
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
			this.bottomTilemap = saveData.bottomTilemap;
			this.tilemapData = saveData.tilemapData;
			this.generateTiles(this.tilemapData, saveData.resources);
			console.log(this);
			console.log(this.getTilemap());
		} else {
			this.generate(allLand, options);
		}

		this._tileHoverListenerCallbacks = [];

		gameManager.loop.on('loop-update', this._onLoopUpdate.bind(this));

		this._onMouseMoveListener = this._onMouseMoveListener.bind(this);
		window.addEventListener('mousemove', this._onMouseMoveListener);
	}

	generate (allLand: boolean, options) {
		const generator = new MapGenerator(this.dimension, this.seed, 'full-grass', allLand);
		generator.generate();
		return;

		let start = performance.now(),
			timePassed = () => {
				return performance.now() - start;
			},
			mapGenUpdate = (message: string) => {
				console.info(`mapGen update: [${message}] @ ${timePassed()}`)
			};
		// Generate a flat map of the biome's base tile
		this.bottomTilemap = _.range(0, (this.dimension * this.dimension)).map(() => this.biome.baseTile);

		mapGenUpdate('generating water');
		// Generate water on the bottom tilemap
		this.bottomTilemap = this.generateWater(this.bottomTilemap, allLand);

		mapGenUpdate('normalizing water');
		// Normalize it
		this.bottomTilemap = this.normalizeWaterTiles(this.bottomTilemap);

		mapGenUpdate('generating tile data');
		// Generate the second layer
		this.generateTiles(this.generateTileData());

		mapGenUpdate('bridging islands');
		// Create bridges between islands√
		var bridgedTiles = this.bridgeIslands();

		mapGenUpdate('generating hills');
		this.generateHills(bridgedTiles, options.hills, options.noHills);

		mapGenUpdate('generating resources');
		this.generateResources(options);

		mapGenUpdate('updatetilemapdata');
		this.updateTilemapData();
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
		this.tilemapData = this.tiles.map(tile => tile.tilemapData);
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

	_getEdgeTiles (): Tile[] {
		if (!this.__edgeTiles) {
			let edgeNumber = this.dimension - 1;
			this.__edgeTiles = this.tiles.filter(tile => {
				return tile.row === 0 ||
					tile.column === 0 ||
					tile.row === edgeNumber ||
					tile.column === edgeNumber;
			});
		}
		return this.__edgeTiles;
	}

	/**
	 * Should return the nearest tile that can be pathed to
	 * to exit the map from the current tile.
	 * NOTE: the tile should be accessible from the start tile.
	 *
	 * @param {Tile} startTile
	 * @return {Tile}
	 */
	getNearestExitTile (startTile: Tile): Tile {
		var sortedEdgeTiles = this._getEdgeTiles().filter(function (tile) {
			return tile.accessible;
		}).sort(function (a, b) {
			return a.distanceTo(startTile) - b.distanceTo(startTile);
		});
		return sortedEdgeTiles[0];
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
					data: this.bottomTilemap,
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
					data: this.tilemapData,
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

	/**
	 * Fills in the given array starting at the tile with
	 * the given mark.
	 *
	 * @param {View2darray} array (description)
	 * @param {Tile} tile (description)
	 * @param {number} mark (description)
	 * @returns View2darray
	 */
	fill (array: any, tile: Tile, mark: number) {
		var filled = floodfill(array, tile.row, tile.column, mark);

		// Mark the tiles themselves with the island number
		for (var i=0; i < array.data.length; i++) {
			if (array.data[i] === mark) {
				this.tiles[i].zoneNumber = mark;
			}
		}
		return filled;
	}


	/**
	 * Fill array based on tiles.
	 *
	 * @returns {View2darray}
	 */
	getFillArray (): any {
		return new ndarray(this.tiles.map(function (tile) {
			return tile.water ? 0 : 1;
		}), [this.dimension, this.dimension]);
	}


	/**
	 * Marks all zones based on accessibility and returns
	 * the floodfilled map
	 *
	 * @returns {View2darray}
	 */
	markZones (): any {
		this.tiles.forEach(tile => {
			tile.zoneNumber = null;
		});

		var getUnmarkedLandTiles = () => {
			return this.tiles.filter(tile => tile.accessible && !tile.zoneNumber);
		};

		var landTiles = getUnmarkedLandTiles();
		zoneNumberCount = zoneNumber;

		// Create nxn array of water vs. non-water tiles
		var array = this.getFillArray();

		while (landTiles.length) {
			this.fill(array, landTiles[0], zoneNumberCount);
			zoneNumberCount++;
			landTiles = getUnmarkedLandTiles();
		}

		return array;
	}

	makeLand (tile: Tile) {
		tile.makeLand();
		this.bottomTilemap[tile.index] = this.biome.baseTile;
	}

	makeBridge (tile: Tile, first: boolean) {
		tile.makeBridge(first);
		// this.bottomTilemap[tile.index] = this.biome.baseTile;
	}

	/**
	 * Flood fill the different land regions after placing water to determine the islands on the map.
	 */
	bridgeIslands (): Tile[] {
		this.markZones();
		// List of all land tiles created as bridge
		var bridgedTiles = [];

		// We've marked all the islands now we need to form bridges
		for (var x=0; x < zoneNumberCount - zoneNumber - 1; x++) {
			// Get all island tiles for first island, and find closest point of all tiles of other islands
			var islandTiles = this.tiles.filter(function (tile) {
					return tile.zoneNumber === zoneNumber && tile.borderWater;
				}),
				otherTiles = this.tiles.filter(function (tile) {
					return tile.zoneNumber && tile.zoneNumber !== zoneNumber && tile.borderWater;
				});

			// We're done
			if (!otherTiles.length) {
				break;
			}

			// Find the pair that are closest
			var closest = {
					distance: 999999999,
					first: null,
					second: null
				}, i;
			for (i=0; i < islandTiles.length; i++) {
				for (var j=0; j < otherTiles.length; j++) {
					var distance = Math.ceil(islandTiles[i].distanceTo(otherTiles[j]));
					if (distance < closest.distance) {
						closest = {
							distance: distance,
							first: islandTiles[i],
							second: otherTiles[j]
						};
					}
				}
			}
			// Now form a bridge between the two island
			// First get a path from the first tile to the second
			var path = this.getPath(closest.first, closest.second);
			// Last tile is land we don't want it
			path.pop();

			var direction;

			// Now create the bridge for the path
			for (i=0; i < path.length; i++) {
				// Grab the neighboring tiles based on direction
				var tile = this.tiles[path[i].row * this.dimension + path[i].column],
					nextTile = i < path.length-1 ? this.tiles[path[i+1].row * this.dimension + path[i+1].column] : null,
					firstOrLast = i === 0 || i === path.length-1;

				direction = nextTile ? tile.directionToTile(nextTile) : direction;

				switch (direction) {
					// We're going left or right so mark the tiles above and below
					case 'left':
						/* falls through */
					case 'right':
						var up = this.tiles[(tile.row-1)*this.dimension + tile.column],
							down = this.tiles[(tile.row+1)*this.dimension + tile.column];

						if (up) {
							this.makeBridge(up, firstOrLast);
							bridgedTiles.push(up);
						}
						if (down) {
							this.makeBridge(down, firstOrLast);
							bridgedTiles.push(down);
						}
						break;
					// We're going up or down so mark the tiles left and right
					case 'up':
						/* falls through */
					case 'down':
						var left = this.tiles[tile.row*this.dimension + tile.column-1],
							right = this.tiles[tile.row*this.dimension + tile.column+1];

						if (left) {
							this.makeBridge(left, firstOrLast);
							bridgedTiles.push(left);
						}
						if (right) {
							this.makeBridge(right, firstOrLast);
							bridgedTiles.push(right);
						}
						break;
				}

				this.makeBridge(tile, firstOrLast);
				bridgedTiles.push(tile);
			}

			// And fill in the second island as a member of the first
			this.fill(this.getFillArray(), closest.second, zoneNumber);
		}

		// Get rid of nubs
		this.getRidOfBridgeNubs(bridgedTiles);

		return bridgedTiles;
	}

	/**
	 * Gets rid of the little single tile inlets created by the bridge code
	 * @return {[type]} [description]
	 */
	getRidOfBridgeNubs (bridgedTiles: Tile[]) {
		// Only check the bridged tiles
		bridgedTiles.forEach(tile => {
			var siblings = tile.getSiblings();

			// Check the siblings because those will be the tiles affected
			siblings.forEach(sibling => {
				if (sibling.water) {
					var neighborMap = this.getTileNeighborMap(this.tiles, sibling.index),
						total = 0;

					for (var direction in neighborMap) {
						if (neighborMap[direction]) {
							total++;
						}
						if (total > 1) {
							return;
						}
					}
					// Edge case when tiles are on the edge of the map, don't touch them
					if (total === 1 && sibling.row !== 0 && sibling.column !== 0) {
						this.makeLand(sibling);
					}
				}
			});
		});
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
	getRandomTile (options: RandomTileOptions = {}): Tile {
		let accessible = options.accessible,
			range = options.range,
			baseTile = options.baseTile;

		var tiles = baseTile ? [] : [].concat(this.tiles);

		// This seems unecessary
		if (!baseTile && accessible) {
			tiles = tiles.filter(function (tile) {
				return tile.accessible === true;
			});
		}

		// Get the set of random tiles to choose from in the given range
		if (range && baseTile) {
			for (var i=Math.max(baseTile.column - range, 0); i <= Math.min(baseTile.column + range, this.dimension); i++) {
				for (var j=Math.max(baseTile.row - range, 0); j <= Math.min(baseTile.row + range, this.dimension); j++) {
					// Don't allow diagonal moves
					if (Math.abs(baseTile.column - i) + Math.abs(baseTile.row - j) > range) {
						continue;
					}
					var tile = this.tiles[j*this.dimension + i];
					// Just in case we're out of bounds
					if (tile && (!accessible || (accessible && tile.accessible))) {
						tiles.push(tile);
					}
				}
			}
		}

		return tiles[Math.floor(Math.random() * tiles.length)];
	}

	getFarthestTile (baseTile: Tile, limit: number, direction: Direction): Tile {
		var i, tile;

		switch (direction) {
			case 'left':
				// Need to start the limit at the farthest tile
				limit = baseTile.column - Math.max(0, baseTile.column - limit);
				for (i=limit; i < baseTile.column; i++) {
					tile = this.tiles[baseTile.index - i];
					if (tile.accessible) {
						return tile;
					}
				}
				break;
			case 'right':
				// Need to start the limit at the farthest tile
				limit = Math.min(this.dimension-1, baseTile.column + limit) - baseTile.column;
				for (i=limit; i > 0; i--) {
					tile = this.tiles[baseTile.index + i];
					if (tile.accessible) {
						return tile;
					}
				}
				break;
			case 'up':
				// Need to start the limit at the farthest tile
				limit = baseTile.row - Math.max(0, baseTile.row - limit);
				for (i=limit; i < baseTile.row; i++) {
					tile = this.tiles[baseTile.index - i*this.dimension];
					if (tile.accessible) {
						return tile;
					}
				}
				break;
			case 'down':
				// Need to start the limit at the farthest tile
				limit = Math.min(this.dimension-1, baseTile.row + limit) - baseTile.row;
				for (i=limit; i > 0; i--) {
					tile = this.tiles[baseTile.index + i*this.dimension];
					if (tile.accessible) {
						return tile;
					}
				}
				break;
			default:
				console.error('No direction specified for getFurthestTile call. Returning original tile.');
				return baseTile;
		}
		// Default to baseTile if no others found
		return baseTile;
	};

	/**
	 * Returns all tiles between the rectangular space between given start and end position
	 *
	 * @param {Object} startPosition x,y coords to start the rectangle (unit: tiles)
	 * @param {Object} endPosition x,y coords to end the rectangle (unit: tiles)
	 *
	 * @return {Tile[]} The list of tiles that fall inside the rectangular area
	 */
	getTilesBetween (startPosition: ICoordinates, endPosition: ICoordinates): Tile[] {
		var tiles = [],
			startX, startY, endX, endY;
		// Return an empty list if either the x or the y has no width
		if (startPosition.x === endPosition.x || startPosition.y === endPosition.y) {
			return tiles;
		}
		// For simplicity we normalize to always be drawing the rectangle top left to bottom right
		if (startPosition.x < endPosition.x) {
			startX = startPosition.x;
			endX = endPosition.x;
		}
		else {
			startX = endPosition.x;
			endX = startPosition.x;
		}
		if (startPosition.y < endPosition.y) {
			startY = startPosition.y;
			endY = endPosition.y;
		}
		else {
			startY = endPosition.y;
			endY = startPosition.y;
		}

		for (var x=startX; x < endX; x++) {
			for (var y=startY; y < endY; y++) {
				tiles.push(this.getTile(y, x));
			}
		}
		return tiles;
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

	/**
	 * Parses all the water tiles and makes sure they have the proper edges displayed based on
	 * neighboring tiles
	 *
	 * @return {[type]} [description]
	 */
	normalizeWaterTiles (data: string[]): any[] {
		// Make sure the water tiles have the proper corner displayed based on neighbors
		return data.map((tile, index) => this.normalizeWaterTile(data, tile, index));
	}

	/**
	 * Returns a map of the neighbors of the tile with a boolean representing whether
	 * the neighbor is water
	 *
	 * @param {[type]} data [description]
	 * @param {Number} index [description]
	 * @return {Function} [description]
	 */
	getTileNeighborMap (data: string[] | Tile[], index: number, checkFunction?: (neighbor: any) => boolean) {
		checkFunction = checkFunction || waterCheckFunction;

		let tileFromRowColumn = (row, column) => {
			return data[row * this.dimension + column];
		};

		let row = Math.floor(index / this.dimension),
			column = index % this.dimension,
			neighborMap = {
				// If it's not the first column
				left: column > 0 ?
					// get the tile to the left
					tileFromRowColumn(row, column - 1) : null,
				// If it's not the last column
				right: column < this.dimension - 1 ?
					tileFromRowColumn(row, column + 1) : null,
				top: row > 0 ?
					tileFromRowColumn(row - 1, column) : null,
				bottom: row < this.dimension - 1 ?
					tileFromRowColumn(row + 1, column) : null,
				topLeft: row > 0 && column > 0 ?
					tileFromRowColumn(row - 1, column - 1) : null,
				topRight: row > 0 && column < this.dimension - 1 ?
					tileFromRowColumn(row - 1, column + 1) : null,
				bottomLeft: row < this.dimension - 1 && column > 0 ?
					tileFromRowColumn(row + 1, column - 1) : null,
				bottomRight: row < this.dimension - 1 && column < this.dimension - 1 ?
					tileFromRowColumn(row + 1, column + 1) : null
			};

		for (var direction in neighborMap) {
			var neighbor = neighborMap[direction];
			// Tiles that are water but aren't bridges
			neighborMap[direction] = checkFunction(neighbor);
		}
		return neighborMap;
	}

	/**
	 * Return the appropriate sprite for a given tile based on its neighbors
	 *
	 * @param {String} tile Sprite name for tile like 'full-grass' or 'water-full'
	 * @param {[type]} index [description]
	 * @return {[type]} [description]
	 */
	normalizeWaterTile (data: string[], tile: string, index: number) {
		if (tile.indexOf('water') !== -1) {
			return this.normalizeTile(data, index, tile, [
				'water-top-left',
				'water-top-middle',
				'water-top-right',
				'water-middle-left',
				'water-middle-right',
				'water-bottom-left',
				'water-bottom-middle',
				'water-bottom-right',
				'water-corner-top-left',
				'water-corner-top-right',
				'water-corner-bottom-left',
				'water-corner-bottom-right',
			]);
		}
		return tile;
	}

	normalizeTile (data: string[] | Tile[], index: number, tile: string,
		sprites: string[], checkFunction?: (neighbor: any) => boolean): string
	{
		checkFunction = checkFunction || waterCheckFunction;

		var row = Math.floor(index / this.dimension),
			column = index % this.dimension,
			neighborMap = this.getTileNeighborMap(data, index, checkFunction);

		// top left
		if (!neighborMap.left && neighborMap.bottom && neighborMap.right && !neighborMap.top) {
			return sprites[0];
		// top middle
		} else if (neighborMap.left && neighborMap.bottom && neighborMap.right && !neighborMap.top) {
			return sprites[1];
		// top right
		} else if (neighborMap.left && neighborMap.bottom && !neighborMap.right && !neighborMap.top) {
			return sprites[2];
		// middle left
		} else if (!neighborMap.left && neighborMap.bottom && neighborMap.right && neighborMap.top) {
			return sprites[3];
		// middle right
		} else if (neighborMap.left && neighborMap.bottom && !neighborMap.right && neighborMap.top) {
			return sprites[4];
		// bottom left
		} else if (!neighborMap.left && !neighborMap.bottom && neighborMap.right && neighborMap.top) {
			return sprites[5];
		// bottom middle
		} else if (neighborMap.left && !neighborMap.bottom && neighborMap.right && neighborMap.top) {
			return sprites[6];
		// bottom right
		} else if (neighborMap.left && !neighborMap.bottom && !neighborMap.right && neighborMap.top) {
			return sprites[7];

		// Top nub
		} else if (sprites.length > 12 &&
				!neighborMap.left && neighborMap.bottom && !neighborMap.right && !neighborMap.top) {
			return sprites[12];
		// Bottom nub
		} else if (sprites.length > 12 &&
				!neighborMap.left && !neighborMap.bottom && !neighborMap.right && neighborMap.top) {
			return sprites[13];
		// Left nub
		} else if (sprites.length > 12 &&
				!neighborMap.left && !neighborMap.bottom && neighborMap.right && !neighborMap.top) {
			return sprites[14];
		// Right nub
		} else if (sprites.length > 12 &&
				neighborMap.left && !neighborMap.bottom && !neighborMap.right && !neighborMap.top) {
			return sprites[15];

		} else {
			// Check corners
			neighborMap = {
				left: null,
				right: null,
				top: null,
				bottom: null,
				topLeft: column > 0 && row > 0 ? data[(row-1) * this.dimension + column-1] : null,
				topRight: column < this.dimension-1 && row > 0 ? data[(row-1) * this.dimension + column+1] : null,
				bottomLeft: column > 0 && row < this.dimension-1 ? data[(row+1) * this.dimension + column-1] : null,
				bottomRight: column < this.dimension-1 && row < this.dimension-1 ? data[(row+1) * this.dimension + column+1] : null,
			};
			for (var direction in neighborMap) {
				var neighbor = neighborMap[direction];
				neighborMap[direction] = checkFunction(neighbor);
			}

			// First check for the hill nub stuff
			if (sprites.length > 12) {
				// Top nub neighbor
				if (!neighborMap.topLeft && !neighborMap.topRight && neighborMap.bottomLeft && neighborMap.bottomRight) {
					return sprites[16];
				// Bottom nub neighbor
				} else if (neighborMap.topLeft && neighborMap.topRight && !neighborMap.bottomLeft && !neighborMap.bottomRight) {
					return sprites[17];
				// Left nub neighbor
				} else if (neighborMap.topLeft && !neighborMap.topRight && neighborMap.bottomLeft && !neighborMap.bottomRight) {
					return sprites[18];
				// Right nub neighbor
				} else if (!neighborMap.topLeft && neighborMap.topRight && !neighborMap.bottomLeft && neighborMap.bottomRight) {
					return sprites[19];
				}
			}

			// corner top left
			if (!neighborMap.topLeft) {
				return sprites[8];
			// corner top right
			} else if (!neighborMap.topRight) {
				return sprites[9];
			// corner bottom left
			} else if (!neighborMap.bottomLeft) {
				return sprites[10];
			// corner bottom right
			} else if (!neighborMap.bottomRight) {
				return sprites[11];
			}
		}
		return tile;
	}

	generateWater (data: string[], allLand?: boolean): string[] {
		if (!allLand) {
			// Use different seed from main map
			perlin.seed(this.seed/2);

			var fragment = 0.45;
			data = data.map((tile, index) => {
				var row = Math.floor(index / this.dimension),
					column = index % this.dimension,
					value = Math.abs(perlin.simplex2(column / 50 * fragment, row / 50 * fragment) * 40);
				if (value < 5) {
					return 'water-full';
				}
				return tile;
			});
		}

		return data;
	}

	/**
	 * Generates tile data for each tile and returns it
	 *
	 * @return {String[]} List of tile data for each tile
	 */
	generateTileData (): string[] {
		var data = [];
		for (var i=0; i < this.dimension*this.dimension; i++) {
			data.push(this.bottomTilemap[i].indexOf('water') !== -1 ? 'empty' : this.getTileForBiome(this.biome.name));
		}

		return data;
	}

	/**
	* Creates tiles and appends them to the GameMap element
	*/
	generateTiles (tileData: string[], resourcesSaveData?: any[]) {
		for (var i=0; i < tileData.length; i++) {
			var tile = new Tile(this, i, {
				data: tileData[i],
				water: this.bottomTilemap[i].indexOf('water') !== -1 ? true : false,
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

	normalizeHillTile (tile: Tile): string {
		let normalized = this.normalizeTile(this.tiles, tile.index, tile.tilemapData, [
			'hill-top-left',
			'hill-top-middle',
			'hill-top-right',
			'hill-middle-left',
			'hill-middle-right',
			'hill-bottom-left',
			'hill-bottom-middle',
			'hill-bottom-right',
			'hill-corner-top-left',
			'hill-corner-top-right',
			'hill-corner-bottom-left',
			'hill-corner-bottom-right',
			'hill-nub-top',
			'hill-nub-bottom',
			'hill-nub-left',
			'hill-nub-right',
			'hill-nub-top-neighbor',
			'hill-nub-bottom-neighbor',
			'hill-nub-left-neighbor',
			'hill-nub-right-neighbor',
		], hillCheckFunction);
		return normalized;
	}

	generateHills (bridgedTiles: Tile[], hillsData: TileCoordinates, noHills: boolean) {
		if (noHills) {
			return;
		}

		if (hillsData) {
			hillsData.forEach(coords => {
				let i = coords[0] * this.dimension + coords[1];
				this.tiles[i].makeHill();
			});

		// Randomize
		} else {
			// Hill seed
			perlin.seed(this.seed/3);

			var fragment = 0.5,
				i;

			for (i=0; i < this.tiles.length; i++) {
				var row = Math.floor(i / this.dimension),
					column = i % this.dimension,
					value = Math.abs(perlin.simplex2(column / 50 * fragment, row / 50 * fragment) * 40);
				if (value > 30 && util.validTiles.resource([this.tiles[i]]).length) {
					this.tiles[i].makeHill();
				}
			}
		}

		this.getRidOfHillNubs();

		this.getRidOfHillsNearBridges(bridgedTiles);

		// Normalize the hill sprites
		for (i=0; i < this.tiles.length; i++) {
			var tile = this.tiles[i];

			let hillTilemapData = (tile => {
				if (tile.hill) {
					return this.normalizeHillTile(tile);
				}
				return null;
			})(tile);
			// console.log(tile.hill, hillTilemapData);
			if (hillTilemapData) {
				tile.hill = hillTilemapData;
				tile.tilemapData = 'empty';
			}
		}
	}

	getRidOfHillsNearBridges (bridgedTiles: Tile[]) {
		// Clear this many tiles in each direction
		var range = 5;

		bridgedTiles.forEach(bridgeTile => {
			for (var i=0; i < range; i++) {
				for (var j=0; j < range; j++) {
					var tile = this.tiles[bridgeTile.index + i * this.dimension + j];
					if (tile && tile.hill) {
						tile.makeLand();
						tile.hill = null;
					}
					tile = this.tiles[bridgeTile.index - i * this.dimension - j];
					if (tile && tile.hill) {
						tile.makeLand();
						tile.hill = null;
					}
				}
			}
		});

		this.tiles.forEach(tile => {
			tile.zoneNumber = null;
		});
		this.markZones();
		var islandsLeft = zoneNumberCount - zoneNumber;
		if (islandsLeft > 1) {
			console.error('Woops we got inaccessbile tiles', islandsLeft);
		}
		// Now we need to calc a path between the islands left and then make a land bridge
		// IE turning hills to land or water to land or whatever.
		// Depending on what is changed that will determine the type of bridge.
		// If water then water-bridge if hill then just land
	}

	// Not sure if this helps
	getRidOfHillNubs () {
		var tiles = this.tiles.filter(tile => {
			return tile.hill;
		});

		// Only check the bridged tiles
		tiles.forEach(tile => {
			var siblings = tile.getSiblings();

			// Check the siblings because those will be the tiles affected
			siblings.forEach(sibling => {
				if (sibling.hill) {
					var neighborMap = this.getTileNeighborMap(this.tiles,
							sibling.index, hillCheckFunction),
						total = 0;

					for (var direction in neighborMap) {
						if (neighborMap[direction]) {
							total++;
						}
						if (total > 1) {
							return;
						}
					}
					// console.log(sibling);
					// Edge case when tiles are on the edge of the map, don't touch them
					if (total === 1 && sibling.row !== 0 && sibling.column !== 0) {
						this.makeLand(sibling);
					}
				}
			});
		});
	}

	/**
	 * This method should determine the required amount of resources for a given map size
	 * And then iterate through and generate clusters of resources on the map
	 */
	generateResources (options: IMapOptions) {
		if (options.noResources) {
			return;
		}
		perlin.seed(this.seed);
		var fragment = 2;

		var clearTiles: Tile[] = [];

		// Let's try something with perlin/simplex noise...
		for (var i=0; i < this.tiles.length; i++) {
			var tile = this.tiles[i],
				value = perlin.simplex2(tile.column / 50 * fragment, tile.row / 50 * fragment);
			value *= 40;
			value = Math.floor(Math.abs(value));

			if (tile.hill) {
				continue;
			}

			// Trees 10%
			if (value > 15) {
				new ResourceCluster('tree', 1, tile);
			// Rocks 2.5%
			} else if (value === 28) {
				// new ResourceCluster('rock', 1, tile);
			// Bushes 2.5%
			} else if (value === 27) {
				// new ResourceCluster('bush', 1, tile);
			} else if (value < 2) {
				clearTiles.push(tile);
			}
		}

		var tilesCount = this.tiles.length,
			// We want 10% of the tiles to be trees
			// treesCount = Math.floor(tilesCount * 0.20),
			// 2.5% to be rocks
			rocksCount = Math.floor(tilesCount * 0.025),
			// 2.0% to be shrooms
			shroomCount = Math.floor(tilesCount * 0.02),
			// 2.5% to be bushes
			bushesCount = Math.floor(tilesCount * 0.025);

		let filteredTiles = util.validTiles.resource(this.tiles);

		// Tree clusters between 6 - 10
		// this.generateResourceClusters('tree', treesCount, [5, 40]);
		// Rock clusters between 10 - 15
		filteredTiles = this.generateResourceClusters('rock', rocksCount, [10, 15], filteredTiles);
		// Bush clusters between 2 - 5
		filteredTiles = this.generateResourceClusters('bush', bushesCount, [2, 5], filteredTiles);
		// Shroom clusters between 3-5
		this.generateResourceClusters('mushroom', shroomCount, [3, 5], filteredTiles);

		// Create some random clearings
		clearTiles.forEach(tile => {
			this.clearTiles({
				position: {
					x: tile.column,
					y: tile.row
				},
				size: {
					width: 8 - fragment,
					height: 8 - fragment
				}
			});
		});
	}

	serialize (): SerializedMapData {
		let data = {
			dimension: this.dimension,
			bottomTilemap: this.bottomTilemap,
			tilemapData: this.tilemapData
		};
		return data;
	}

	/**
	 * Generates clusters of the given resource type.
	 *
	 * @param {String} type The type of resource
	 * @param {Number} amount Creates clusters with that total up to 'amount'.
	 * @param {Number[]} clusterBounds Cluster bounds determines the ranges of size for each cluster.
	 */
	generateResourceClusters (
		type: string,
		amount: number,
		clusterBounds: [number, number],
		filteredTiles: Tile[]
	): Tile[] {
		while (amount > 0) {
			var clusterSize = util.randomInRange(clusterBounds[0], clusterBounds[1]);
			amount -= clusterSize;

			// Pick the starting tile for cluster from all filtered tiles
			let tileIndex = util.randomInRange(0 ,filteredTiles.length, false, false),
				randomTile = filteredTiles[tileIndex];

			// Generate the cluster
			new ResourceCluster(type, clusterSize, randomTile);

			// Remove the tile from the filtered list
			filteredTiles.splice(tileIndex, 1);
		}
		return filteredTiles;
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
		// If the tile passes the checkMethod
		if (checkMethod(tile)) {
			return tile;
		}
		var emptyTile;

		var x = 0,
			y = 0,
			delta = [0, -1],
			width = 9999,
			height = 9999;

		// Spiral out and find the first empty tile
		while (!emptyTile && Math.abs(x) <= this.dimension && Math.abs(y) <= this.dimension) {
			// console.log(x, y, this.dimension);
			if (((-width/2 < x) && (x <= width/2)) && ((-height/2 < y) && (y <= height/2))) {
				var checkTile = this.getTile(tile.row+x, tile.column+y);
				// If the tile passes the checkMethod
				if (checkTile && checkMethod(checkTile)) {
					emptyTile = checkTile;
				}
			}

			// Check if it's time to change direction
			if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1-y)) {
				delta = [-delta[1], delta[0]];
			}

			x += delta[0];
			y += delta[1];
		}
		return emptyTile;
	}

	/**
	 * Find the nearest tile from the startTile that is at
	 * the edge of the map
	 *
	 * @param {Tile} startTile
	 * @return Tile
	 */
	getNearestEdgeTile (startTile: Tile): Tile {
		var leftMostTile = this.tiles[startTile.row * this.dimension + 0],
			rightMostTile = this.tiles[startTile.row * this.dimension + this.dimension-1],
			topMostTile = this.tiles[0 + startTile.column],
			bottomMostTile = this.tiles[(this.dimension-1)* this.dimension + startTile.column],
			// Sort them by their distance to the startTile
			sorted = [leftMostTile, rightMostTile, topMostTile, bottomMostTile].sort((a, b) => {
				return a.distanceTo(startTile) - b.distanceTo(startTile);
			});

		// The first in the list that is accessible is the one we want
		for (var i=0; i < sorted.length; i++) {
			if (sorted[i].accessible) {
				return sorted[i];
			}
		}
	}

	/**
	 * Clears a rectangular area of all resources
	 *
	 * @param {Object} data
	 * @param {Object} data.position x,y coords to start clear
	 * @param {Object} data.size width, height integer dimensions of clear space
	 */
	clearTiles (data: ClearTilesInput) {
		var tileStart = data.position,
			clearDimensions = data.size,
			tileEnd = {
				x: tileStart.x + clearDimensions.width,
				y: tileStart.y + clearDimensions.height
			};
		for (var x = tileStart.x; x < tileEnd.x; x++) {
			for (var y = tileStart.y; y < tileEnd.y; y++) {
				var tile = this.getTile(y, x);
				if (tile) {
					tile.clearResource();
				}
			}
		}
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
	getPath (fromTile: Tile, toTile: Tile, bridgeGrid?: string[]): PathCoordinates[] {
		// console.log('ay');
		// var worker = new Worker('/build/scripts/worker.js');
		// worker.postMessage('sup brah');

		// Do it with sync astar instead
		var result = aStar(bridgeGrid ?
			this.bridgeGrid() :
			this.grid(), [fromTile.column, fromTile.row], [toTile.column, toTile.row], 'Manhattan');

		if (!result.length) {
			console.log('pathfinding failed on inputs');
			console.log(fromTile, toTile);
			console.log('Tile accessible?', toTile.accessible);
			console.log('-------------');
		} else {
			// Slice off the first entry because it's the current tile
			result = result.slice(1);
		}

		result = result.map(entry => {
			return {
				column: entry[0],
				row: entry[1]
			};
		});

		return result;
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
		// Watch bounds
		if ((row < 0 || column < 0) || row >= this.dimension || column >= this.dimension) {
			return null;
		}
		var index = (row * this.dimension) + column;
		return this.tiles[index];
	}
}