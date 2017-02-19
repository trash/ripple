import {IRowColumnCoordinates, IRowColumnCoordinateWrapper, XYCoordinates,
	IRandomTileOptions, Direction} from '../interfaces';
import {AStar as aStar} from '../vendor/astar';
import {constants} from '../data/constants';
import {MapTile} from './tile';

export class MapUtil {
    /**
	* Takes a pair of tiles and returns a callback that returns the A* path
	*
	* @param {Tile} fromTile The tile to start the path from
	* @param {Tile} toTile The tile to path to
	* @return {PathCoordinates[]}
	*/
	static getPath (
        grid: number[][],
        fromTile: IRowColumnCoordinates,
        toTile: IRowColumnCoordinates
    ): IRowColumnCoordinates[] {
		// console.log('ay');
		// var worker = new Worker('/build/scripts/worker.js');
		// worker.postMessage('sup brah');

		// Do it with sync astar instead
		let result = aStar(grid, [fromTile.column, fromTile.row],
            [toTile.column, toTile.row], 'Manhattan');

		if (!result.length) {
			console.log('pathfinding failed on inputs');
			console.log(fromTile, toTile);
			console.log('Tile accessible?', grid[toTile.row][toTile.column] === constants.ACCESSIBLE);
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

	static distanceTo (
		start: IRowColumnCoordinates,
		end: IRowColumnCoordinates,
		floor: boolean = false
	) {
		const x = Math.pow((start.column - end.column), 2);
		const y = Math.pow((start.row - end.row), 2);
		const distance = Math.sqrt(x + y);

		return floor ?
			Math.floor(distance) :
			distance;
	}

	/**
	* Return the nearest tile from the set to the current tile
	*/
	static nearestTileFromSet (
		startTile: IRowColumnCoordinates,
		tileSet: IRowColumnCoordinates[]
	): number {
		let nearestDistance = 999999;
		let nearestIndex = null;
		tileSet.forEach((tile, index) => {
			const distance = this.distanceTo(startTile, tile);
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestIndex = index;
			}
		});
		return nearestIndex;
	};

	/*
	* Picks and returns a random tile.
	*
	* @param {Boolean} [accessible] Whether or not the tile should be accessible
	* @param {Number} [range] The range (radius) of tiles to wander around between (i.e. a square of tiles to select from)
	* @param {Tile} [basetile] If range is passed, the baseTile to search from
	*
	* @return {Tile} The random tile
	*/
	static getRandomTile (
		inputTiles: MapTile[],
		options: IRandomTileOptions = {}
	): MapTile {
		const dimension = Math.sqrt(inputTiles.length);
		const accessible = options.accessible,
			range = options.range,
			baseTile = options.baseTile;

		let tiles: MapTile[] = baseTile ? [] : [].concat(inputTiles);

		// Get the set of random tiles to choose from in the given range
		if (range && baseTile) {
			for (let i=Math.max(baseTile.column - range, 0);
				i <= Math.min(baseTile.column + range, dimension); i++
			) {
				for (let j=Math.max(baseTile.row - range, 0);
					j <= Math.min(baseTile.row + range, dimension); j++
				) {
					// Don't allow diagonal moves
					if (Math.abs(baseTile.column - i) + Math.abs(baseTile.row - j) > range) {
						continue;
					}
					const tile = MapUtil.getTile(inputTiles, j, i);
					// Just in case we're out of bounds
					if (tile && !tile.isEqualToCoords(baseTile) && (!accessible || (accessible && tile.accessible))) {
						tiles.push(tile);
					}
				}
			}
		}

		return tiles[Math.floor(Math.random() * tiles.length)];
	}

	/**
	 * Returns all tiles between the rectangular space between given start and end position
	 *
	 * @param {Object} startPosition x,y coords to start the rectangle (unit: tiles)
	 * @param {Object} endPosition x,y coords to end the rectangle (unit: tiles)
	 *
	 * @return {Tile[]} The list of tiles that fall inside the rectangular area
	 */
	static getTilesBetween<T extends IRowColumnCoordinates> (
		inputTiles: T[],
		startPosition: XYCoordinates,
		endPosition: XYCoordinates
	): T[] {
		const tiles = [];
		let startX, startY, endX, endY;
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
				tiles.push(this.getTile(inputTiles, y, x));
			}
		}
		return tiles;
	}

	/**
	 * Find the nearest tile from the startTile that is at
	 * the edge of the map
	 *
	 * @param {Tile} startTile
	 * @return Tile
	 */
	static getNearestEdgeTiles<T extends IRowColumnCoordinates> (
		tiles: T[],
		startTile: T
	): T[] {
		const dimension = Math.sqrt(tiles.length);
		const leftMostTile = tiles[startTile.row * dimension + 0];
		const rightMostTile = tiles[startTile.row * dimension + dimension - 1];
		const topMostTile = tiles[0 + startTile.column];
		const bottomMostTile = tiles[(dimension - 1) * dimension + startTile.column];

		// Sort them by their distance to the startTile
		return [leftMostTile, rightMostTile, topMostTile, bottomMostTile]
			.sort((a, b) =>
				this.distanceTo(a, startTile) - this.distanceTo(b, startTile)
		);
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
	static getTile<T extends IRowColumnCoordinates> (
		tiles: T[],
		row: number,
		column: number
	): T {
		const dimension = Math.sqrt(tiles.length);
		// Watch bounds
		if ((row < 0 || column < 0) || row >= dimension || column >= dimension) {
			return null;
		}
		var index = (row * dimension) + column;
		return tiles[index];
	}

	static getFarthestTile<T extends IRowColumnCoordinates> (
		tiles: T[],
		baseTile: T,
		limit: number,
		direction: Direction
	): T {
		let i, tile;
		const dimension = Math.sqrt(tiles.length),
			baseTileIndex = baseTile.row * dimension + baseTile.column;

		switch (direction) {
			case 'left':
				// Need to start the limit at the farthest tile
				limit = Math.max(0, baseTile.column - limit);
				for (i = limit; i < baseTile.column; i++) {
					tile = tiles[i + baseTile.row * dimension];
					if (tile.accessible) {
						return tile;
					}
				}
				break;
			case 'right':
				// Need to start the limit at the farthest tile
				limit = Math.min(dimension - 1, baseTile.column + limit);
				for (i = limit; i > baseTile.column; i--) {
					tile = tiles[i + baseTile.row * dimension];
					if (tile.accessible) {
						return tile;
					}
				}
				break;
			case 'up':
				// Need to start the limit at the farthest tile
				limit = Math.max(0, baseTile.row - limit);
				for (i = limit; i < baseTile.row; i++) {
					tile = tiles[baseTile.column + i * dimension];
					if (tile.accessible) {
						return tile;
					}
				}
				break;
			case 'down':
				// Need to start the limit at the farthest tile
				limit = Math.min(dimension - 1, baseTile.row + limit);
				for (i = limit; i > baseTile.row; i--) {
					tile = tiles[baseTile.column + i * dimension];
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
	}

	static arrayToRowColumnCoordinatesArray<T> (
		inputArray: T[]
	): IRowColumnCoordinateWrapper<T>[] {
		const dimension = Math.sqrt(inputArray.length);
		return inputArray.map((item, i) => {
			return {
				value: item,
				column: i % dimension,
				row: Math.floor(i / dimension),
				index: i
			};
		});
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
	static getNearestTile<T extends IRowColumnCoordinates> (
		tiles: T[],
		tile: T,
		checkMethod: (tile: T) => boolean
	): T {
		// If the tile passes the checkMethod
		if (checkMethod(tile)) {
			return tile;
		}
		const dimension = Math.sqrt(tiles.length);

		let match,
			x = 0,
			y = 0,
			delta = [0, -1],
			width = 9999,
			height = 9999;

		// Spiral out and find the first empty tile
		while (!match && Math.abs(x) <= dimension && Math.abs(y) <= dimension) {
			// console.log(x, y, this.dimension);
			if (((-width/2 < x) && (x <= width/2)) && ((-height/2 < y) && (y <= height/2))) {
				const checkTile = this.getTile(tiles, tile.row + x, tile.column + y);
				// If the tile passes the checkMethod
				if (checkTile && checkMethod(checkTile)) {
					match = checkTile;
				}
			}

			// Check if it's time to change direction
			if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1-y)) {
				delta = [-delta[1], delta[0]];
			}

			x += delta[0];
			y += delta[1];
		}
		return match;
	}
}