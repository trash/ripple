/// <reference path="ndarray.d.ts" />
import {perlin} from '../vendor/perlin';
import {floodfill} from '../vendor/flood-fill';
import {NDArray, ICoordinates} from '../interfaces';
import ndarray = require('ndarray');
import {MapGenTile} from './map-gen-tile';
import Immutable = require('immutable');
import {MapUtil} from './map-util';
import {constants} from '../data/constants';
import {util, Util} from '../util';
import {ResourceCluster} from './resource-cluster';

type NeighborCheckFunction<T> = (neighbor: T) => boolean;

const waterCheckFunction: NeighborCheckFunction<string> = (neighbor: string): boolean => {
		if (!neighbor) {
			return true;
		}
		// Check if they're water tiles. If they're at the edge of the map (no neighbor)
		// then just act like the water continues off the map
		return neighbor.indexOf('water') !== -1 && neighbor.indexOf('bridge') === -1;
	},
	hillCheckFunction: NeighborCheckFunction<MapGenTile> = (tile: MapGenTile) => tile && tile.isHill;

type NeighborMap<T> = {
    left: T;
    right: T;
    top: T;
    bottom: T;
    topLeft: T;
    topRight: T;
    bottomLeft: T;
    bottomRight: T;
}

interface IClearTilesInput {
	position: ICoordinates;
	size: {
		width: number;
		height: number;
	};
};

let zoneNumberStart = 10,
	zoneNumberCount;

export class MapGenerator {
    startTime: number;
    dimension: number;
    seed: number;
    allLand: boolean;
    baseTile: string;

    constructor (
        dimension: number,
        seed: number,
        baseTile: string,
        allLand: boolean = false
    ) {
        this.startTime = performance.now();
        this.dimension = dimension;
        this.seed = seed;
        this.allLand = allLand;
        this.baseTile = baseTile;
    }

    generate () {
        // Generate a flat map of the biome's base tile
        let baseTilemap: string[] = _.range(0, (this.dimension * this.dimension))
            .map(() => this.baseTile);

		this.logUpdate('generating water');
		// Generate water on the bottom tilemap
		baseTilemap = this.generateWater(baseTilemap);

		this.logUpdate('normalizing water');
		// Normalize it
		baseTilemap = this.normalizeWaterTiles(baseTilemap);

		let tiles = Immutable.List<MapGenTile>(
			baseTilemap.map((tile, index) => new MapGenTile(tile, index, this.dimension)));

		this.logUpdate('marking border water tiles');
		tiles = this.markBorderWaterTiles(tiles);

		this.logUpdate('bridging islands');
		// Create bridges between islands√
        tiles = this.bridgeIslands(tiles);

		this.logUpdate('generating hills');
		tiles = this.generateHills(tiles);

		this.logUpdate('cleaning up hills');
		// this.cleanupHills(tiles, bridgedTiles);

		this.logUpdate('generating resources');
		// tiles = this.generateResources(tiles);
		const resources = this.generateResources(tiles);
		console.log(resources);

		this.logUpdate('updatetilemapdata');
		const upperTilemap = tiles.map(tile => tile.data).toArray();
		console.log(upperTilemap);

		this.logUpdate('complete');
		return {
			upperTilemap: upperTilemap,
			baseTilemap: baseTilemap,
			resources: resources
		};
    }

	/**
	 * Makes a tile a hill and returns a copy of it with the necessary
	 * changes. Does not modify the original tile.
	 */
	_makeTileHill (tile: MapGenTile, hillTilemapData?: string): MapGenTile {
		// Making it land will wipe out the tilemap data and give us a copy
		const copy = this._makeTileLand(tile);
		copy.isHill = true;
		copy.hillData = hillTilemapData;
		return copy;
	}

	/**
	 * Makes a tile a bridge tile by updating its data attribute.
	 * This method does not modify the input object but returns a copy of
	 * the object with the property modified.
	 */
	_makeTileBridge (tile: MapGenTile, firstBridgeTile: boolean): MapGenTile {
		// Don't do anything if it's not water
		if (!tile.isWater) {
			return tile;
		}
		const copy = MapGenTile.copyTile(tile);
		copy.data = firstBridgeTile ?
			'water-bridge-base' :
			util.randomFromList(['water-bridge-1', 'water-bridge-2', 'water-bridge-3']);
		return copy;
	}

	/**
	 * Returns a copy of the tile modified to have its data be land.
	 */
	_makeTileLand (tile: MapGenTile): MapGenTile {
		const copy = MapGenTile.copyTile(tile);
		copy.data = 'empty';
		copy.isHill = false;
		return copy;
	}

	_clearZoneNumbers (tiles: Immutable.List<MapGenTile>): Immutable.List<MapGenTile> {
		return tiles.withMutations(tiles => {
			tiles.forEach(tile => {
				const copy = MapGenTile.copyTile(tile);
				copy.zoneNumber = null;
				tiles.set(tile.index, copy);
			});
		})
	}

	_getResourceCluster (
		tiles: Immutable.List<MapGenTile>,
		size: number,
		tile: MapGenTile
	): MapGenTile[] {
		const clusterTiles: MapGenTile[] = [];

		for (let i = 0; i < size - 1; i++) {
			// Give me the next closest tile without a resource and without water
			const nextTile = MapUtil.getNearestEmptyTile(tiles.toArray(), tile, (checkTile) => {
				return !(checkTile as MapGenTile).resource &&
					!!Util.validTiles.resource([checkTile as MapGenTile]).length;
			}) as MapGenTile;
			// No more free tiles?
			if (!nextTile) {
				break;
			}

			clusterTiles.push(nextTile);
		}
		console.info('we should be clearing tiles here?');
		return clusterTiles;
	}

	/**
	 * Generates clusters of the given resource type.
	 *
	 * @param {String} type The type of resource
	 * @param {Number} amount Creates clusters with that total up to 'amount'.
	 * @param {Number[]} clusterBounds Cluster bounds determines the ranges of size for each cluster.
	 */
	generateResourceClusters (
		tiles: Immutable.List<MapGenTile>,
		type: string,
		amount: number,
		clusterBounds: [number, number],
		filteredTiles: MapGenTile[]
	): MapGenTile[] {
		while (amount > 0) {
			const clusterSize = util.randomInRange(clusterBounds[0], clusterBounds[1]);
			amount -= clusterSize;

			// Pick the starting tile for cluster from all filtered tiles
			const tileIndex = util.randomInRange(0 ,filteredTiles.length, false, false),
				randomTile = filteredTiles[tileIndex];

			// Generate the cluster
			const clusterTiles = this._getResourceCluster(tiles, clusterSize, randomTile);
			console.log('we need to be generating resources somehow with these clusterTiles');

			// Remove the tile from the filtered list
			filteredTiles.splice(tileIndex, 1);
		}
		return filteredTiles;
	}

	/**
	 * Clears a rectangular area of all resources
	 *
	 * @param {Object} data
	 * @param {Object} data.position x,y coords to start clear
	 * @param {Object} data.size width, height integer dimensions of clear space
	 */
	clearTiles (tiles: Immutable.List<MapGenTile>, data: IClearTilesInput) {
		const tileStart = data.position,
			clearDimensions = data.size,
			tileEnd = {
				x: tileStart.x + clearDimensions.width,
				y: tileStart.y + clearDimensions.height
			};
		const tilesToClear = [];
		for (let x = tileStart.x; x < tileEnd.x; x++) {
			for (let y = tileStart.y; y < tileEnd.y; y++) {
				const tile = MapUtil.getTile(tiles.toArray(), y, x);
				if (tile) {
					tilesToClear.push(tile);
				}
			}
		}
		return tiles.withMutations(tiles => {
			tilesToClear.forEach(tile => {
				const copy = MapGenTile.copyTile(tile);
				copy.resource = null;
				tiles.set(tile.index, copy);
			});
		});
	}

	generateResources (tiles: Immutable.List<MapGenTile>): Immutable.List<string> {
		perlin.seed(this.seed);
		const fragment = 2;

		return Immutable.List<string>(tiles.map((tile, i) => {
			let value = perlin.simplex2(tile.column / 50 * fragment, tile.row / 50 * fragment);
			value *= 40;
			value = Math.floor(Math.abs(value));

			// Trees 10%
			if (value > 15) {
				return 'tree';
			// Rocks 2.5%
			} else if (value === 28) {
				return 'rock';
			// Bushes 2.5%
			} else if (value === 27) {
				return 'bush';
			} else if (value < 2) {
				// clearTiles.push(tile);
				return null;
			}
			return null;
		}));
	}

	/**
	 * This method should determine the required amount of resources for a given map size
	 * And then iterate through and generate clusters of resources on the map
	 */
	generateResourcesOLD (tiles: Immutable.List<MapGenTile>): Immutable.List<MapGenTile> {
		perlin.seed(this.seed);
		const fragment = 2;

		var clearTiles: MapGenTile[] = [];

		tiles.filter(tile => !tile.isHill).forEach(tile => {
			let value = perlin.simplex2(tile.column / 50 * fragment, tile.row / 50 * fragment);
			value *= 40;
			value = Math.floor(Math.abs(value));

			// Trees 10%
			if (value > 15) {
				const treeTiles = this._getResourceCluster(tiles, 1, tile);
				tiles = tiles.withMutations(tiles => {
					treeTiles.forEach(tile => {
						const copy = MapGenTile.copyTile(tile);
						copy.resource = 'tree';
						tiles.set(tile.index, copy);
					});
				});
			// Rocks 2.5%
			} else if (value === 28) {
				// new ResourceCluster('rock', 1, tile);
			// Bushes 2.5%
			} else if (value === 27) {
				// new ResourceCluster('bush', 1, tile);
			} else if (value < 2) {
				clearTiles.push(tile);
			}
		});

		const tilesCount = tiles.size,
			// We want 20% of the tiles to be trees
			// treesCount = Math.floor(tilesCount * 0.20),
			// 2.5% to be rocks
			rocksCount = Math.floor(tilesCount * 0.025),
			// 2.0% to be shrooms
			shroomCount = Math.floor(tilesCount * 0.02),
			// 2.5% to be bushes
			bushesCount = Math.floor(tilesCount * 0.025);

		let filteredTiles = Util.validTiles.resource(tiles.toArray());

		// Tree clusters between 6 - 10
		// this.generateResourceClusters('tree', treesCount, [5, 40]);
		// Rock clusters between 10 - 15
		filteredTiles = this.generateResourceClusters(tiles, 'rock', rocksCount, [10, 15], filteredTiles);
		// Bush clusters between 2 - 5
		filteredTiles = this.generateResourceClusters(tiles, 'bush', bushesCount, [2, 5], filteredTiles);
		// Shroom clusters between 3-5
		this.generateResourceClusters(tiles, 'mushroom', shroomCount, [3, 5], filteredTiles);

		// Create some random clearings
		clearTiles.forEach(tile => {
			tiles = this.clearTiles(tiles, {
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

		return tiles;
	}

	getRidOfHillsNearBridges (
		tiles: Immutable.List<MapGenTile>,
		bridgedTiles: MapGenTile[]
	): Immutable.List<MapGenTile> {
		// Clear this many tiles in each direction
		const range = 5,
			tilesToMakeLand: MapGenTile[] = [];

		bridgedTiles.forEach(bridgeTile => {
			for (var i=0; i < range; i++) {
				for (var j=0; j < range; j++) {
					[
						tiles.get(bridgeTile.index + i * this.dimension + j),
						tiles.get(bridgeTile.index - i * this.dimension - j)
					].forEach(tile => {
						if (tile && tile.isHill) {
							tilesToMakeLand.push(tile);
						}
					});
				}
			}
		});

		tiles = tiles.withMutations(tiles => {
			tilesToMakeLand.forEach(tile => {
				tiles.set(tile.index, this._makeTileLand(tile));
			});
		});
		// Removing some hills might have caused some bugs with islands???
		// tiles = this._clearZoneNumbers(tiles);

		// this.markZones();
		// var islandsLeft = zoneNumberCount - zoneNumber;
		// if (islandsLeft > 1) {
		// 	console.error('Woops we got inaccessbile tiles', islandsLeft);
		// }
		// Now we need to calc a path between the islands left and then make a land bridge
		// IE turning hills to land or water to land or whatever.
		// Depending on what is changed that will determine the type of bridge.
		// If water then water-bridge if hill then just land

		return tiles;
	}

	// Not sure if this helps
	getRidOfHillNubs (
		tiles: Immutable.List<MapGenTile>
	): Immutable.List<MapGenTile> {
		const hillTiles = tiles.filter(tile => tile.isHill),
			tilesToMakeLand: MapGenTile[] = [];

		// Only check the bridged tiles
		hillTiles.forEach(tile => {
			var siblings = tile.getSiblings();

			// Check the siblings because those will be the tiles affected
			siblings.forEach(siblingIndex => {
				const sibling = tiles.get(siblingIndex);
				if (sibling.isHill) {
					const neighborMap = this.getTileNeighborMap(tiles.toArray(),
							sibling.index, hillCheckFunction);
					let total = 0;

					for (let direction in neighborMap) {
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
						tilesToMakeLand.push(sibling);
					}
				}
			});
		});
		return tiles.withMutations(tiles => {
			tilesToMakeLand.forEach(tile => {
				tiles.set(tile.index, this._makeTileLand(tile));
			});
		});
	}

	cleanupHills (
		tiles: Immutable.List<MapGenTile>,
		bridgedTiles: MapGenTile[]
	): Immutable.List<MapGenTile> {
		tiles = this.getRidOfHillNubs(tiles);

		tiles = this.getRidOfHillsNearBridges(tiles, bridgedTiles);

		const tilesToMakeHills: [MapGenTile, string][] = [];

		// Normalize the hill sprites
		tiles.filter(hillCheckFunction).forEach(tile => {
			const hillTilemapData = this.normalizeHillTile(tiles, tile);
			tilesToMakeHills.push([tile, hillTilemapData]);
		});

		return tiles.withMutations(tiles => {
			tilesToMakeHills.forEach(pair => {
				const tile = pair[0],
					hillTilemapData = pair[1];
				tiles.set(tile.index, this._makeTileHill(tile, hillTilemapData));
			});
		});
	}

	generateHills (
		tiles: Immutable.List<MapGenTile>,
		hillsData?: ICoordinates[],
		noHills: boolean = false
	) {
		if (noHills) {
			return;
		}

		const tilesToMakeHills: number[] = [];
		if (hillsData) {
			hillsData.forEach(coords => {
				let i = coords.y * this.dimension + coords.x;
				tilesToMakeHills.push(i);
			});

		// Randomize
		} else {
			// Hill seed
			perlin.seed(this.seed/3);

			var fragment = 0.5,
				i;

			for (i=0; i < tiles.size; i++) {
				var row = Math.floor(i / this.dimension),
					column = i % this.dimension,
					value = Math.abs(perlin.simplex2(
						column / 50 * fragment, row / 50 * fragment) * 40);
				if (value > 30 && Util.validTiles.resource([tiles.get(i)]).length) {
					tilesToMakeHills.push(i);
				}
			}
		}

		// Create the hills and return the modified tiles
		return tiles.withMutations(tiles => {
			tilesToMakeHills.forEach(tileIndex => {
				const tile = tiles.get(tileIndex);
				tiles.set(tileIndex, this._makeTileHill(tile));
			});
		});
	}

	/**
	 * Returns the list of tiles with the borderWater property properly marked
	 * for each.
	 */
	markBorderWaterTiles (tiles: Immutable.List<MapGenTile>): Immutable.List<MapGenTile> {
		const markedSiblings = [];
		tiles.forEach(tile => {
			if (tile.isWater) {
				tile.getSiblings().forEach(siblingIndex => {
					const sibling = tiles.get(siblingIndex);
					if (sibling && !sibling.isWater) {
						markedSiblings.push(siblingIndex);
					}
				});
			}
		});

		return tiles.withMutations(tiles =>
			tiles.forEach((tile, i) => {
				if (markedSiblings.includes(i)) {
					tiles.update(i, tile => {
						const copy = MapGenTile.copyTile(tile);
						copy.borderWater = true;
						return copy;
					});
				}
				return tile;
			}));
	}

    /**
	 * Fill array based on tiles.
	 *
	 * @returns {View2darray}
	 */
	getFillArray (tiles: Immutable.List<MapGenTile>): NDArray<number> {
		return new ndarray(tiles.map(tile => tile.isWater ? 0 : 1).toArray(),
			[this.dimension, this.dimension]);
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
	fill (
		tiles: Immutable.List<MapGenTile>,
		tile: MapGenTile,
		mark: number
	) {
		const array = this.getFillArray(tiles);
		floodfill(array, tile.row, tile.column, mark);

		// Mark the tiles themselves with the island number
		tiles = tiles.withMutations(tiles => {
			for (var i=0; i < array.data.length; i++) {
				if (array.data[i] === mark) {
					const copy = MapGenTile.copyTile(tiles.get(i));
					copy.zoneNumber = mark;
					tiles.set(i, copy);
				}
			}
		});

		return tiles;
	}

	getUnmarkedLandTiles (tiles: Immutable.List<MapGenTile>): Immutable.List<MapGenTile> {
		return tiles.filter(tile => tile.accessible && !tile.zoneNumber);
	}

    /**
	 * Marks all zones based on accessibility and returns
	 * the floodfilled map.
	 */
	markZones (tiles: Immutable.List<MapGenTile>): Immutable.List<MapGenTile> {
		const zoneNumberMap = [];

		let landTiles = this.getUnmarkedLandTiles(tiles);
		zoneNumberCount = zoneNumberStart;

		// Create nxn array of water vs. non-water tiles
		const array = this.getFillArray(tiles);

		while (landTiles.size) {
			tiles = this.fill(tiles, landTiles.get(0), zoneNumberCount);
			zoneNumberCount++;
			landTiles = this.getUnmarkedLandTiles(tiles);
		}

		return tiles;
	}

	_tilesToGrid (
		tiles: Immutable.List<MapGenTile>,
		ignoreAccessible: boolean = false
	): number[][] {
		const grid = [],
			dimension = tiles.get(0).dimension;
		for (let i = 0; i < dimension; i++) {
			grid.push([]);
			for (let j = 0; j < dimension; j++) {
				let value;
				if (ignoreAccessible) {
					value = constants.ACCESSIBLE;
				} else {
					value = tiles.get(i * dimension + j).accessible ?
						constants.ACCESSIBLE :
						constants.INACCESSIBLE
				}
				grid[i].push(value);
			}
		}
		return grid;
	}

	/**
	 * Flood fill the different land regions after placing water to determine the islands on the map.
	 */
	bridgeIslands (tiles: Immutable.List<MapGenTile>): Immutable.List<MapGenTile> {
		tiles = this.markZones(tiles);

		// Only one/two zones means no separated land masses. Nothing to do.
		if (zoneNumberCount <= zoneNumberStart + 1) {
			return tiles;
		}
		const bridgedTiles: ([MapGenTile, boolean])[] = [];

		// We've marked all the islands now we need to form bridges
		for (let x = 0; x < zoneNumberCount - zoneNumberStart - 1; x++) {
			const borderTiles = tiles.filter(tile => tile.zoneNumber && tile.borderWater);
			// Get all border tiles for first island
			const islandTiles = borderTiles.filter(tile => tile.zoneNumber === zoneNumberStart),
			// Get border tiles for the rest of the tiles
				otherTiles = borderTiles.filter(tile => tile.zoneNumber !== zoneNumberStart);

			// We're done
			if (!otherTiles.size) {
				break;
			}

			// Find the pair that are closest
			var closest = {
					distance: 999999999,
					first: null,
					second: null
				}, i;
			for (i=0; i < islandTiles.size; i++) {
				for (var j=0; j < otherTiles.size; j++) {
					var distance = Math.ceil(islandTiles.get(i).distanceTo(otherTiles.get(j)));
					if (distance < closest.distance) {
						closest = {
							distance: distance,
							first: islandTiles.get(i),
							second: otherTiles.get(j)
						};
					}
				}
			}

			// Now form a bridge between the two island
			// First get a path from the first tile to the second
			const path = MapUtil.getPath(this._tilesToGrid(tiles, true), closest.first, closest.second);
			// Last tile is land we don't want it
			path.pop();

			let direction;

			// Now create the bridge for the path
			for (i=0; i < path.length; i++) {
				// Grab the neighboring tiles based on direction
				const tile = tiles.get(path[i].row * this.dimension + path[i].column),
					nextTile = i < path.length - 1 ?
						tiles.get(path[i + 1].row * this.dimension + path[i + 1].column) :
						null,
					firstOrLast = i === 0 || i === path.length - 1;

				direction = nextTile ? tile.directionToTile(nextTile) : direction;

				switch (direction) {
					// We're going left or right so mark the tiles above and below
					case 'left':
						/* falls through */
					case 'right':
						const up = tiles.get((tile.row - 1) * this.dimension + tile.column),
							down = tiles.get((tile.row + 1) * this.dimension + tile.column);

						if (up) {
							bridgedTiles.push([up, firstOrLast]);
						}
						if (down) {
							bridgedTiles.push([down, firstOrLast]);
						}
						break;
					// We're going up or down so mark the tiles left and right
					case 'up':
						/* falls through */
					case 'down':
						var left = tiles.get(tile.row * this.dimension + tile.column - 1),
							right = tiles.get(tile.row * this.dimension + tile.column + 1);

						if (left) {
							bridgedTiles.push([left, firstOrLast]);
						}
						if (right) {
							bridgedTiles.push([right, firstOrLast]);
						}
						break;
				}

				bridgedTiles.push([tile, firstOrLast]);
			}

			// And fill in the second island as a member of the first
			tiles = this.fill(tiles, closest.second, zoneNumberStart);
		}

		// Update the tiles and create a new list with the modified tiles
		tiles = tiles.withMutations(tiles => {
			bridgedTiles.forEach(pair => {
				const tile = pair[0],
					firstOrLast = pair[1];
				tiles.set(tile.index, this._makeTileBridge(tile, firstOrLast));
			});
		});

		return tiles;
	}

    generateWater (data: string[]): string[] {
		if (!this.allLand) {
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
	 * Returns a map of the neighbors of the tile with a boolean representing whether
	 * the neighbor is water
	 *
	 * @param {[type]} data [description]
	 * @param {Number} index [description]
	 * @return {Function} [description]
	 */
	getTileNeighborMap<T, R> (
        data: T[],
        index: number,
        checkFunction: NeighborCheckFunction<R>
    ): NeighborMap<T> {
		const tileFromRowColumn = (row, column) => {
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

    normalizeTile<T> (
        data: T[],
        index: number,
        tile: string,
		sprites: string[],
        checkFunction: NeighborCheckFunction<T>
    ): string {
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
				topLeft: column > 0 && row > 0 ?
					data[(row-1) * this.dimension + column-1] :
					null,
				topRight: column < this.dimension-1 && row > 0 ?
					data[(row-1) * this.dimension + column+1] :
					null,
				bottomLeft: column > 0 && row < this.dimension-1 ?
					data[(row+1) * this.dimension + column-1] :
					null,
				bottomRight: column < this.dimension-1 && row < this.dimension-1 ?
					data[(row+1) * this.dimension + column+1] :
					null,
			};
			for (var direction in neighborMap) {
				var neighbor = neighborMap[direction];
				neighborMap[direction] = checkFunction(neighbor);
			}

			// First check for the hill nub stuff
			if (sprites.length > 12) {
				// Top nub neighbor
				if (!neighborMap.topLeft && !neighborMap.topRight && neighborMap.bottomLeft
					&& neighborMap.bottomRight
				) {
					return sprites[16];
				// Bottom nub neighbor
				} else if (neighborMap.topLeft && neighborMap.topRight && !neighborMap.bottomLeft
					&& !neighborMap.bottomRight
				) {
					return sprites[17];
				// Left nub neighbor
				} else if (neighborMap.topLeft && !neighborMap.topRight && neighborMap.bottomLeft
					&& !neighborMap.bottomRight
				) {
					return sprites[18];
				// Right nub neighbor
				} else if (!neighborMap.topLeft && neighborMap.topRight && !neighborMap.bottomLeft
					&& neighborMap.bottomRight
				) {
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

    /**
	 * Return the appropriate sprite for a given tile based on its neighbors
	 *
	 * @param {String} tile Sprite name for tile like 'full-grass' or 'water-full'
	 * @param {[type]} index [description]
	 * @return {[type]} [description]
	 */
	normalizeWaterTile (data: string[], tile: string, index: number): string {
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
			], waterCheckFunction);
		}
		return tile;
	}

	normalizeHillTile (
		tiles: Immutable.List<MapGenTile>,
		tile: MapGenTile
	): string {
		return this.normalizeTile(
			tiles.toArray(),
			tile.index,
			tile.data,
			[
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

    logUpdate (message: string) {
        const timePassed = performance.now() - this.startTime;
        console.info(`mapGen update: [${message}] @ ${timePassed}`);
    }
}