import * as _ from 'lodash';
import {b3} from '../index';
import {util} from '../../util';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {IAgentSearchOptions} from '../../interfaces';
import {agentUtil} from '../../entity/util/agent';

export class CheckForNearbyAgent extends BaseNode {
	options: IAgentSearchOptions;
	targetKey: string;
	targetTileKey: string;
	distance: number;

	constructor (
		options: IAgentSearchOptions,
		targetKey: string,
		targetTileKey: string,
		distance?: number
	) {
		super();

		this.options = options;
		this.targetKey = targetKey;
		this.targetTileKey = targetTileKey;
		this.distance = distance;
		this.description = 'check for nearby agent';
	}
	tick (tick: Tick) {
		const agentData = tick.target;
		const target = agentUtil.getClosestAgentToTile(_.extend(this.options, {
			cannotHaveId: agentData.id
		}), agentData.position.tile, this.distance);

		// No match or the closest match is out of range
		// NOTE: distance should be optional
		if (!target) {
			return b3.FAILURE;
		}
		// Set the entity id
		util.blackboardSet(tick, this.targetKey, target.id);
		// Set the agent's tile
		util.blackboardSet(tick, this.targetTileKey, target.position.tile);
		return b3.SUCCESS;
	}
}