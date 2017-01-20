import {b3} from '../index';
import {util} from '../../util';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {buildingUtil} from '../../entity/util/building';

/**
 * An action to just make a citizen wait for a turn
 */
export class BuildingWithSpaceIsNearby extends BaseNode {
	blackboardKey: string;

	constructor (blackboardKey: string) {
		super();
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Tick) {
		const target = tick.target;
		const building = buildingUtil.getNearestBuildingWithOccupantSpace();

		if (building) {
			util.blackboardSet(tick, this.blackboardKey, building);
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}