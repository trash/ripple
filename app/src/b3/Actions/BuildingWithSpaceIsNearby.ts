import * as _ from 'lodash';
import {b3} from '../index';
import {util} from '../../util';
import {IRowColumnCoordinates} from '../../interfaces';
import * as Core from '../Core';
import {buildingUtil} from '../../entity/util';
import {Building} from '../../data/Building';

type StartTileCallback = (tick: Core.Tick) => IRowColumnCoordinates;

/**
 * An action to just make a citizen wait for a turn
 */
export class BuildingWithSpaceIsNearby extends Core.BaseNode {
	building: Building | null;
	blackboardKey: string;
	startTileCallback: StartTileCallback;

	constructor (
		building: Building | null,
		blackboardKey: string,
		startTileCallback: StartTileCallback
	) {
		super();
		this.blackboardKey = blackboardKey;
		this.startTileCallback = startTileCallback;
		this.building = building;
	}

	tick (tick: Core.Tick) {
		const target = tick.target;
		const building = buildingUtil.getNearestBuildingWithOccupantSpace(
			this.startTileCallback(tick),
			this.building
		);

		if (_.isNumber(building)) {
			util.blackboardSet(tick, this.blackboardKey, building);
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}