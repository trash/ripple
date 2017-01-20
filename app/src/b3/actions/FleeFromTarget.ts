import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';
import {agentUtil} from '../../entity/util/agent';

export class FleeFromTarget extends BaseNode {
	blackboardKey: string;

	constructor (blackboardKey: string) {
		super();
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Tick) {
		const agent = tick.target.id;
		const nearby = util.blackboardGet(tick, this.blackboardKey);

		agentUtil.fleeFromTarget(tick.target.turn, agent, nearby);
		return b3.SUCCESS;
	}
}