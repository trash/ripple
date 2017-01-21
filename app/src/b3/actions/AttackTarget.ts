import {b3} from '../index';
import {util} from '../../util';
import * as Core from '../core';
import {agentUtil} from '../../entity/util/agent';

export class AttackTarget extends Core.BaseNode {
	targetKey: string;

	constructor (targetKey: string) {
		super();
		this.targetKey = targetKey;
	}

	tick (tick: Core.Tick) {
		const agent = tick.target;
		const target: number = util.blackboardGet(tick, this.targetKey);

		const successfulAttack = agentUtil.attackAgent(agent.turn, agent.id, target);

		if (successfulAttack) {
			return b3.RUNNING;
		}
		return b3.FAILURE;
	}
}