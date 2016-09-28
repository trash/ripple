import {IRowColumnCoordinates} from '../interfaces';
import {AStar as aStar} from '../vendor/astar';
import {constants} from '../data/constants';

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
		var result = aStar(grid, [fromTile.column, fromTile.row],
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
}