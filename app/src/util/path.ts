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
		callerIdentifier: string,
		targetIdentifier: string,
		target: IRowColumnCoordinates
	): IRowColumnCoordinates {
		const funcName = 'getNextStepToTarget';
		// Create a unique cacheable identifier for the caller/target pair
		const identifier = [callerIdentifier, targetIdentifier];
		const cached = cacheService.getValue(funcName, identifier);
		if (cached && this.validateCachedPath(tile, cached)) {
			return this.getNextStepFromPath(tile, cached);
		}
		const path = globalRefs.map.getPath(tile, target);
		cacheService.store(funcName, identifier, path, 500);
		return path[0];
	}

	static getFleeTile (
		agent: IRowColumnCoordinates,
		target: IRowColumnCoordinates,
		distance: number = 1
	): IRowColumnCoordinates {
		const map = globalRefs.map;

		// Figure out the opposite direction
		const goRight = agent.column >= target.column;
		const goDown = agent.row >= target.row;

		let direction;
		// If at a vertical boundary, go horizontal
		if ((agent.column === 0 && !goDown) || (agent.column === map.dimension && goDown)) {
			direction = (goRight ? 'right' : 'left');
		}
		// If at a horizontal boundary, go vertical
		else if ((agent.row === 0 && !goRight) || (agent.row === map.dimension && goRight)) {
			direction = (goDown ? 'down' : 'up');
		}
		// 50/50 choose going up/down or left/right if not at a boundary
		direction = direction || (Math.random() > 0.50) ?
			(goRight ? 'right' : 'left') :
			(goDown ? 'down' : 'up');

		// Pass true to make sure it's accessible
		return map.getFarthestTile(agent, distance, direction);
	}
}