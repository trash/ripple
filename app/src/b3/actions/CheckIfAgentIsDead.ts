import {b3} from '../';
import * as Core from '../core';
import {util} from '../../util';
import {agentUtil} from '../../entity/util/agent';

export class CheckIfAgentIsDead extends Core.BaseNode {
	targetKey: string;

	constructor (targetKey) {
		super();
		this.targetKey = targetKey;
	}

	tick (tick: Core.Tick) {
		const agent = tick.target;
		const target: number = util.blackboardGet(tick, this.targetKey);
		if (agentUtil.agentIsDead(target)) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}