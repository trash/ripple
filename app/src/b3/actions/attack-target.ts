import {b3} from '../index';
import {util} from '../../util';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {agentUtil} from '../../entity/util/agent';

export class AttackTarget extends BaseNode {
	targetKey: string;

	constructor (targetKey: string) {
		super();
		this.targetKey = targetKey;
	}

	tick (tick: Tick) {
		const agent = tick.target;
		const target: number = util.blackboardGet(tick, this.targetKey);

		const successfulAttack = agentUtil.attackAgent(agent.id, target);

		if (successfulAttack) {
			return b3.RUNNING;
		}
		return b3.FAILURE;
	}
}