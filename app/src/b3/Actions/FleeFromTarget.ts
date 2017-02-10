import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';
import {agentUtil} from '../../entity/util';

export class FleeFromTarget extends Core.BaseNode {
	blackboardKey: string;

	constructor (blackboardKey: string) {
		super();
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Core.Tick) {
		const agent = tick.target.id;
		const nearby = util.blackboardGet(tick, this.blackboardKey);

		agentUtil.fleeFromTarget(tick.target.turn, agent, nearby);
		return b3.SUCCESS;
	}
}