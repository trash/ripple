import * as _ from 'lodash';;
import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';
import {PathUtil} from '../../util/path';
import {MapUtil} from '../../map/map-util';
import {positionUtil} from '../../entity/util';
import {IPositionState} from '../../entity/components/position';
import {IRowColumnCoordinates, dropOffTargetKeyOrFunctionType} from '../../interfaces';

type updateDescription = (tick: Core.Tick, target: IRowColumnCoordinates) => void;

export class GoToTarget extends Core.BaseNode {
	targetKeyOrFunction: dropOffTargetKeyOrFunctionType;
	updateDescription: updateDescription;
	distance: number;

	constructor (
		targetKeyOrFunction: dropOffTargetKeyOrFunctionType,
		distance: number = 1,
		updateDescription: updateDescription = _.noop,
	) {
		super();
		this.targetKeyOrFunction = targetKeyOrFunction;
		this.updateDescription = updateDescription;
		this.distance = distance;
	}

	tick (tick: Core.Tick) {
		const agentData = tick.target;
		const target: IRowColumnCoordinates = util.targetKeyOrFunction(
			tick,
			this.targetKeyOrFunction
		);
		if (!target) {
			return b3.FAILURE;
		}

		this.updateDescription(tick, target);

		// Success if we're already somehow at the target before doing anything
		if (MapUtil.distanceTo(agentData.position.tile, target) <= this.distance) {
			return b3.SUCCESS;
		}

		const tileCoords = PathUtil.getNextStepToTarget(
			agentData.position.tile,
			agentData.id.toString(),
			`${target.row}${target.column}`,
			target
		);
		if (!tileCoords) {
			return b3.FAILURE;
		}
		positionUtil.setTile(
			agentData.position,
			tileCoords,
			agentData.turn,
			agentData.agent.speed
		);

		// Success if we reached the target
		if (MapUtil.distanceTo(tileCoords, target) <= this.distance) {
			return b3.SUCCESS;
		}
		return b3.RUNNING;
	};
}