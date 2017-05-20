/// <reference path="ndarray.d.ts" />
import * as _ from 'lodash';
import {perlin} from '../vendor/perlin';
import {floodfill} from '../vendor/flood-fill';
import {NDArray, XYCoordinates, IRowColumnCoordinateWrapper} from '../interfaces';
import ndarray = require('ndarray');
import {TileData} from './TileData';
import {MapGenTile} from './MapGenTile';
import * as Immutable from 'immutable';
import {MapUtil} from './map-util';
import {constants} from '../data/constants';
import {Util} from '../util';
import {Resource} from '../data/Resource';
import * as seedrandom from 'seedrandom';

type NeighborCheckFunction<T> = (neighbor: T) => boolean;

export interface IMapGenReturn {
	baseTilemap: string[],
	upperTilemap: string[],
	resourceList: Resource[]
};

const isValidResourceTile = (
	resource: Resource,
	i: number,
	tiles: Immutable.List<MapGenTile>
): boolean => !resource && !tiles.get(i).isWater;

const waterCheckFunction: NeighborCheckFunction<string>
	= (neighbor: string): boolean => {
		if (!neighbor) {
			return true;
		}
		// Check if they're water tiles. If they're at the edge of the map (no neighbor)
		// then just act like the water continues off the map
		return neighbor.indexOf('water') !== -1
			&& neighbor.indexOf('bridge') === -1;
	}
const hillCheckFunction: NeighborCheckFunction<MapGenTile>
	= (tile: MapGenTile) => !!tile;

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
	position: XYCoordinates;
	size: {
		width: number;
		height: number;
	};
};

interface IBiomeRatiosMap {
	[key: string]: number;
}

interface IBiome {
	name: string;
	baseTile: string;
	ratios: IBiomeRatiosMap
}

const zoneNumberStart = 10;
let zoneNumberCount;

export class MapGenerator {
    private startTime: number;
    private dimension: number;
    private seed: number;
    private allLand: boolean;
    private biome: IBiome;
	private logEnabled: boolean;
	private seedrandom: seedrandom.prng;

    constructor (
        dimension: number,
        seed: number,
        biome: IBiome,
        allLand: boolean = false,
		logEnabled: boolean = true
    ) {
        this.startTime = performance.now();
        this.dimension = dimension;
        this.seed = seed;
        this.allLand = allLand;
        this.biome = biome;
		this.logEnabled = logEnabled;
		this.seedrandom = seedrandom(this.seed + '');
    }

    generate (noResources: boolean): IMapGenReturn {
        // Generate a flat map of the biome's base tile
        let baseTilemap: string[] = _.range(0, (this.dimension * this.dimension))
            .map(() => this.biome.baseTile);

		this.logUpdate('generating water');
		// Generate water on the bottom tilemap
		baseTilemap = this.generateWater(baseTilemap);

		this.logUpdate('normalizing water');
		// Normalize it
		baseTilemap = this.normalizeWaterTiles(baseTilemap);

		let tiles = Immutable.List<MapGenTile>(
			baseTilemap.map((tile, index) => {
				const isWater = tile.includes('water');
				return new MapGenTile(
					isWater
						? 'empty'
						: Util.randomFromRatios(this.biome.ratios, this.seedrandom),
					index,
					this.dimension,
					isWater
				);
			})
		);

		this.logUpdate('marking border water tiles');
		tiles = this.markBorderWaterTiles(tiles);

		this.logUpdate('bridging islands');
		// Create bridges between islands√
        tiles = this.bridgeIslands(tiles);

		const resourceList = noResources
			? Immutable.List<Resource>()
			: this.generateResourceList(tiles);

		const upperTilemap = tiles.map(tile => tile.data);

		this.logUpdate('complete');
		return {
			upperTilemap: upperTilemap.toArray(),
			baseTilemap: baseTilemap,
			resourceList: resourceList.toArray()
		};
    }

	private generateResourceList (
		tiles: Immutable.List<MapGenTile>
	): Immutable.List<Resource> {
		let resourceList = Immutable.List<Resource>(new Array(tiles.size).fill(null));

		this.logUpdate('generating hills');
		resourceList = this.generateHills(tiles, resourceList);

		this.logUpdate('generating resources');
		resourceList = this.generateResources(tiles, resourceList);

		return resourceList;
	}

	/**
	 * Makes a tile a bridge tile by updating its data attribute.
	 * This method does not modify the input object but returns a copy of
	 * the object with the property modified.
	 */
	private makeTileBridge (tile: MapGenTile, firstBridgeTile: boolean): MapGenTile {
		// Don't do anything if it's not water
		if (!tile.isWater) {
			return tile;
		}
		const copy = MapGenTile.copyTile(tile);
		copy.data = firstBridgeTile ?
			'water-bridge-base' :
			Util.randomFromList(['water-bridge-1', 'water-bridge-2', 'water-bridge-3']);
		return copy;
	}

	private clearZoneNumbers (tiles: Immutable.List<MapGenTile>): Immutable.List<MapGenTile> {
		return tiles.withMutations(tiles => {
			tiles.forEach(tile => {
				const copy = MapGenTile.copyTile(tile);
				copy.zoneNumber = null;
				tiles.set(tile.index, copy);
			});
		})
	}

	/**
	 * Returns a list of the indices of tiles suitable to spawn
	 * resources on in a cluster around the given starting tile index.
	 *
	 * @param {Immutable.List<string>} tiles
	 * @param {number} size
	 * @param {number} startTileIndex
	 * @param {(tile: IRowColumnCoordinateWrapper<string>) => boolean} checkFunction
	 * @returns {number[]}
	 */
	private getResourceCluster (
		tiles: Immutable.List<Resource>,
		size: number,
		startTileIndex: number,
		checkFunction: (tile: IRowColumnCoordinateWrapper<Resource>) => boolean,
		markFunction: (tile: IRowColumnCoordinateWrapper<Resource>) => IRowColumnCoordinateWrapper<Resource>
	): number[] {
		const clusterTiles: number[] = [];
		const searchTiles = MapUtil.arrayToRowColumnCoordinatesArray(tiles.toArray());
		const startTile = searchTiles[startTileIndex];

		for (let i = 0; i < size - 1; i++) {
			// Give me the next closest tile without a resource and without water
			const nextTile = MapUtil.getNearestTile(searchTiles, startTile, checkFunction);
			// No more free tiles?
			if (!nextTile) {
				break;
			}
			// Mark the tile
			searchTiles[nextTile.index] = markFunction(searchTiles[nextTile.index]);

			clusterTiles.push(nextTile.index);
		}
		return clusterTiles;
	}

	generateResourceClusters (
		tiles: Immutable.List<MapGenTile>,
		resourceList: Immutable.List<Resource>,
		type: Resource,
		amount: number,
		clusterBounds: [number, number]
	): Immutable.List<Resource> {
		let clusterTiles: number[] = [];
		while (amount > 0) {
			const clusterSize = Util.randomInRange(clusterBounds[0], clusterBounds[1]);
			amount -= clusterSize;

			// Pick the starting tile for cluster from all filtered tiles
			const tileIndex = Util.randomInRange(0 , tiles.size, false, false);

			// Generate the cluster
			clusterTiles = clusterTiles.concat(
				this.getResourceCluster(
					resourceList,
					clusterSize,
					tileIndex,
					tile => isValidResourceTile(tile.value, tile.index, tiles),
					tile => {
						tile.value = Resource.MapGenMark;
						return tile
					}
				)
			);
		}

		return resourceList.withMutations(resourceList => {
			clusterTiles.forEach(index => {
				resourceList.set(index, type);
			});
		});
	}

	/**
	 * Clears a rectangular area of all resources
	 *
	 * @param {Object} data
	 * @param {Object} data.position x,y coords to start clear
	 * @param {Object} data.size width, height integer dimensions of clear space
	 */
	clearTiles (tiles: Immutable.List<MapGenTile>, data: IClearTilesInput) {
		const tileStart = data.position;
		const clearDimensions = data.size;
		const tileEnd = {
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

	generateResources (
		tiles: Immutable.List<MapGenTile>,
		resourceList: Immutable.List<Resource>
	): Immutable.List<Resource> {
		perlin.seed(this.seed);
		const fragment = 2;

		// Generate trees via perlin noise
		resourceList = resourceList.map((resource, i) => {
			if (!isValidResourceTile(resource, i, tiles)) {
				return resource;
			}
			const column = i % this.dimension;
			const row = Math.floor(i / this.dimension);
			let value = perlin.simplex2(column / 50 * fragment, row / 50 * fragment);
			value *= 40;
			value = Math.floor(Math.abs(value));

			if (value > 15) {
				return Resource.Tree;
			}
			return null;
		}).toList();

		// Generate everything else via clusters
		const tilesCount = resourceList.size;
		// 2.5% to be rocks
		const rocksCount = Math.floor(tilesCount * 0.025);
		// 2.0% to be shrooms
		const shroomCount = Math.floor(tilesCount * 0.02);
		// 2.5% to be bushes
		const bushesCount = Math.floor(tilesCount * 0.025);

		resourceList = this.generateResourceClusters(
			tiles, resourceList, Resource.Rock, rocksCount, [10, 15]
		);
		resourceList = this.generateResourceClusters(
			tiles, resourceList, Resource.Bush, bushesCount, [2, 5]
		);
		resourceList = this.generateResourceClusters(
			tiles, resourceList, Resource.Mushroom, rocksCount, [3, 5]
		);

		return resourceList;
	}

	generateHills (
		tiles: Immutable.List<MapGenTile>,
		resourceList: Immutable.List<Resource>,
		noHills: boolean = false
	): Immutable.List<Resource> {
		if (noHills) {
			return;
		}
		// Hill seed
		perlin.seed(this.seed / 3);

		const fragment = 0.5;
		let i;

		for (i = 0; i < tiles.size; i++) {
			const row = Math.floor(i / this.dimension);
			const column = i % this.dimension;
			const value = Math.abs(
				perlin.simplex2(column / 50 * fragment, row / 50 * fragment) * 40
			);
			if (value > 30 && Util.validTiles.resource([tiles.get(i)]).length) {
				resourceList = resourceList.set(i, Resource.Hill);
			}
		}
		return resourceList;
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
			for (let i = 0; i < array.data.length; i++) {
				if (array.data[i] === mark) {
					const copy = MapGenTile.copyTile(tiles.get(i));
					copy.zoneNumber = mark;
					tiles.set(i, copy);
				}
			}
		});

		return tiles;
	}

	getUnmarkedLandTiles (
		tiles: Immutable.List<MapGenTile>
	): Immutable.List<MapGenTile> {
		return tiles
			.filter(tile => tile.accessible && !tile.zoneNumber)
			.toList();
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

	private tilesToGrid (
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
			const islandTiles = borderTiles.filter(tile => tile.zoneNumber === zoneNumberStart);
			// Get border tiles for the rest of the tiles
			const otherTiles = borderTiles.filter(tile => tile.zoneNumber !== zoneNumberStart);

			// We're done
			if (!otherTiles.size) {
				break;
			}

			// Find the pair that are closest
			let closest = {
				distance: 999999999,
				first: null,
				second: null
			};
			let i;
			for (i = 0; i < islandTiles.size; i++) {
				for (let j = 0; j < otherTiles.size; j++) {
					const distance = Math.ceil(islandTiles.get(i).distanceTo(otherTiles.get(j)));
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
			const path = MapUtil.getPath(this.tilesToGrid(tiles, true), closest.first, closest.second);
			// Last tile is land we don't want it
			path.pop();

			let direction;

			// Now create the bridge for the path
			for (i = 0; i < path.length; i++) {
				// Grab the neighboring tiles based on direction
				const tile = tiles.get(path[i].row * this.dimension + path[i].column);
				const nextTile = i < path.length - 1
					? tiles.get(path[i + 1].row * this.dimension + path[i + 1].column)
					: null;
				const firstOrLast = i === 0 || i === path.length - 1;

				direction = nextTile ? tile.directionToTile(nextTile) : direction;

				switch (direction) {
					// We're going left or right so mark the tiles above and below
					case 'left':
						/* falls through */
					case 'right':
						const up = tiles.get((tile.row - 1) * this.dimension + tile.column);
						const down = tiles.get((tile.row + 1) * this.dimension + tile.column);

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
						const left = tiles.get(tile.row * this.dimension + tile.column - 1);
						const right = tiles.get(tile.row * this.dimension + tile.column + 1);

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
				const tile = pair[0];
				const firstOrLast = pair[1];
				tiles.set(tile.index, this.makeTileBridge(tile, firstOrLast));
			});
		});

		return tiles;
	}

    generateWater (data: string[]): string[] {
		if (!this.allLand) {
			// Use different seed from main map
			perlin.seed(this.seed/2);

			const fragment = 0.45;
			data = data.map((tile, index) => {
				const row = Math.floor(index / this.dimension);
				const column = index % this.dimension;
				const value = Math.abs(
					perlin.simplex2(column / 50 * fragment, row / 50 * fragment) * 40
				);
				if (value < 5) {
					return TileData.waterFull;
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

		const row = Math.floor(index / this.dimension);
		const column = index % this.dimension;
		const neighborMap = {
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

		for (const direction in neighborMap) {
			const neighbor = neighborMap[direction];
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
		const row = Math.floor(index / this.dimension);
		const column = index % this.dimension;
		let neighborMap = this.getTileNeighborMap(data, index, checkFunction);

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
			for (const direction in neighborMap) {
				const neighbor = neighborMap[direction];
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
	normalizeWaterTiles (data: string[]): string[] {
		// Make sure the water tiles have the proper corner displayed based on neighbors
		return data.map((tile, index) => this.normalizeWaterTile(data, tile, index));
	}

    logUpdate (message: string): void {
		if (!this.logEnabled) {
			return;
		}
        const timePassed = performance.now() - this.startTime;
        console.info(`mapGen update: [${message}] @ ${timePassed}`);
    }
}