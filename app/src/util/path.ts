import {cacheService} from '../services/cache';
import {util} from './index';
import {GameMap} from '../map';
import {MapUtil} from '../map/map-util';
import {IRowColumnCoordinates} from '../interfaces';
import {IPositionState} from '../entity/components/position';
import {events} from '../events';

const globalRefs: {
	map: GameMap
} = {
	map: null
};
events.on('map-update', (map: GameMap) => {
	globalRefs.map = map;
});

export class PathUtil {
    private static getIndexFromPath (
		tile: IRowColumnCoordinates,
		path: IRowColumnCoordinates[]
	): number {
		return _.findIndex(path, {
			column: tile.column,
			row: tile.row
		});
	}

    private static getNextStepFromPath (
		tile: IRowColumnCoordinates,
		path: IRowColumnCoordinates[]
	): IRowColumnCoordinates {
		let index = this.getIndexFromPath(tile, path);
		// If it's -1, we want the first one
		// otherwise we want the next one
		index++;
		if (index === path.length) {
			index--;
		}
		return path[index];
	}

	private static validateCachedPath (
		tile: IRowColumnCoordinates,
		path: IRowColumnCoordinates[]
	): boolean {
		let index = this.getIndexFromPath(tile, path);
		if (!path.length) {
			return false;
		// If they're nowhere near the original path, it's not valid
		} else if (!index) {
			const distance = MapUtil.distanceTo(tile, path[0]);
			if (distance > 1) {
				return false;
			}
		// If they passed the halfway mark, it's not valid
		} else if (index >= path.length / 2) {
			return false;
		}
		return true;
	}
    /**
	 * Get the next step to the target.
	 * Target in this case can be either a building or an agent.
	 *
	 * @param {Object} target Agent or buildings
	 * @return {Tile}
	 */
	static getNextStepToTarget (
		tile: IRowColumnCoordinates,
		targetId: number,
		target: IRowColumnCoordinates
	): IRowColumnCoordinates {
		const funcName = 'getNextStepToTarget';
		const cached = cacheService.get(funcName, [targetId]);
		if (cached && this.validateCachedPath(tile, cached)) {
			return this.getNextStepFromPath(tile, cached);
		}
		const path = globalRefs.map.getPath(tile, target);
		cacheService.store(funcName, [targetId], path, 500);
		return path[0];
	}
}