import _ = require('lodash');
import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';
import {PathUtil} from '../../util/path';
import {MapUtil} from '../../map/map-util';
import {IPositionState} from '../../entity/components/position';

export class GoToTarget extends BaseNode {
	targetKeyOrFunction: string | Function;
	updateDescription: (tick: any, target: any) => void;

	constructor (
		targetKeyOrFunction: string | Function,
		updateDescription?: (tick: any, target: any) => void
	) {
		super();
		this.targetKeyOrFunction = targetKeyOrFunction;
		this.updateDescription = updateDescription || _.noop;
	}

	tick (tick: Tick) {
		const agentData = tick.target;
		let target: {
			id: number,
			position: IPositionState
		} = util.targetKeyOrFunction(tick, this.targetKeyOrFunction);
		if (!target) {
			return b3.FAILURE;
		}

		this.updateDescription(tick, target);

		// Success if we're already somehow at the target before doing anything
		if (MapUtil.distanceTo(agentData.position.tile, target.position.tile) <= 1) {
			return b3.SUCCESS;
		}

		const tileCoords = PathUtil.getNextStepToTarget(agentData.position.tile,
			target.id, target.position);
		if (!tileCoords) {
			return b3.FAILURE;
		}
		util.setTile(agentData.position, tileCoords, agentData.turn, agentData.agent.speed);

		// Success if we reached the target
		if (MapUtil.distanceTo(tileCoords, target.position.tile) <= 1) {
			return b3.SUCCESS;
		}
		return b3.RUNNING;
	};
}