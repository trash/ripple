import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';

export class WasRecentlyAttacked extends Core.BaseNode {
	turnsSinceLastAttack: number;
	blackboardKey: string;

	constructor (blackboardKey: string, turnsSinceLastAttack: number) {
		super();
		this.turnsSinceLastAttack = turnsSinceLastAttack;
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Core.Tick) {
		const target = tick.target;
		const agent = target.agent;
		const wasRecentlyAttacked = agent.lastAttacked &&
				(target.turn - agent.lastAttacked) / agent.speed < this.turnsSinceLastAttack;
		util.blackboardSet(tick, this.blackboardKey, agent.lastAttacker);
		if (wasRecentlyAttacked) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}