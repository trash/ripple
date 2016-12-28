import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';

export class WasRecentlyAttacked extends BaseNode {
	turnsSinceLastAttack: number;
	blackboardKey: string;

	constructor (blackboardKey: string, turnsSinceLastAttack: number) {
		super();
		this.turnsSinceLastAttack = turnsSinceLastAttack;
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Tick) {
		const target = tick.target;
		const agent = target.agent;
		const wasRecentlyAttacked = agent.lastAttacked ?
				(target.turn - agent.lastAttacked) / agent.speed < this.turnsSinceLastAttack :
				null;
		util.blackboardSet(tick, this.blackboardKey, agent.lastAttacker);
		if (wasRecentlyAttacked) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}