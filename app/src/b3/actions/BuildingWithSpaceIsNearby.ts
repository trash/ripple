import {b3} from '../index';
import {util} from '../../util';
import * as Core from '../core';
import {buildingUtil} from '../../entity/util/building';

/**
 * An action to just make a citizen wait for a turn
 */
export class BuildingWithSpaceIsNearby extends Core.BaseNode {
	blackboardKey: string;

	constructor (blackboardKey: string) {
		super();
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Core.Tick) {
		const target = tick.target;
		const building = buildingUtil.getNearestBuildingWithOccupantSpace();

		if (building) {
			util.blackboardSet(tick, this.blackboardKey, building);
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}