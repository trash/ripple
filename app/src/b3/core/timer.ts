import {b3} from '../index';
import {util} from '../../util';
import {gameClock} from '../../game/game-clock';
import * as Core from './index';

var timerKey = 'timer:hours-passed';

interface ITimerOptions extends Core.IDecoratorOptions {
	hours: number;
}

/**
 * The Inverter decorator inverts the result of the child, returning `SUCCESS`
 * for `FAILURE` and `FAILURE` for `SUCCESS`.
 *
 * @module b3
 * @class Inverter
 * @extends Decorator
**/
export class Timer extends Core.Decorator {
	hours: number;

	constructor (options: ITimerOptions) {
		super(options);
	}

	initialize (options: ITimerOptions) {
		super.initialize(options as Core.IDecoratorOptions);

		this.hours = options.hours || null;
	}
	open (tick: Core.Tick) {
		util.blackboardSet(tick, timerKey, false);
		gameClock.timer(this.hours, () => {
			util.blackboardSet(tick, timerKey, true);
		});
	}
	/**
	 * Tick method.
	 * @method tick
	 * @param {Tick} tick A tick instance.
	 * @return {Constant} A state constant.
	**/
	tick (tick: Core.Tick) {
		if (!this.child || !this.hours) {
			debugger;
			return b3.ERROR;
		}
		let timerDone = util.blackboardGet(tick, timerKey);

		if (!timerDone) {
			return b3.RUNNING;
		}

		// Run the child after the timer is done and return its status
		return this.executeChild(tick, this.child);
	}
}