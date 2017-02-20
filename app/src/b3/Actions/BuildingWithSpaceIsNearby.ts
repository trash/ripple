import * as _ from 'lodash';
import {b3} from '../index';
import {util} from '../../util';
import * as Core from '../Core';
import {buildingUtil} from '../../entity/util';

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

		if (_.isNumber(building)) {
			util.blackboardSet(tick, this.blackboardKey, building);
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}