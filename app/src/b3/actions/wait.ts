import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';

const blackboardKey = 'current-wait-turn';

export class Wait extends BaseNode {
	hours: number;
	turns: number;

	/**
	 * An action to just make a citizen wait for a turn
	 *
	 * @param {Number} [hours] Optionally wait for the given amount of hours
	 */
	constructor (hours?: number) {
		super();
		this.initialize();
		this.hours = hours;
		this.turns = null;
		this.description = 'Waiting.';
	}

	open (tick: Tick) {
		if (!this.hours) {
			return;
		}
		var agentData = tick.target;
		this.turns = util.hoursToTicks(this.hours) / agentData.agent.speed;
		util.blackboardSet(tick, blackboardKey, 0);
	};

	tick (tick: Tick) {
		const agent = tick.target;
		const currentTurn = util.blackboardGet(tick, blackboardKey);
		if (!this.hours || currentTurn === this.turns) {
			return b3.SUCCESS;
		}
		util.blackboardSet(tick, blackboardKey, currentTurn + 1);
		return b3.RUNNING;
	};
}