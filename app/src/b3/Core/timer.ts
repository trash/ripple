import {b3} from '../index';
import {util} from '../../util';
import {uniqueId} from '../../uniqueId';
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
	id: string;

	initialize (options: ITimerOptions) {
		super.initialize(options as Core.IDecoratorOptions);

		this.hours = options.hours || null;
		this.id = uniqueId.get();

		// console.log('timer init', this.id, this.hours);
	}
	open (tick: Core.Tick) {
		util.blackboardSet(tick, timerKey, false, this.id);
		tick.target.clock.timer(this.hours, () => {
			util.blackboardSet(tick, timerKey, true, this.id);
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
		const timerDone = util.blackboardGet(tick, timerKey, this.id);

		if (!timerDone) {
			return b3.RUNNING;
		}

		// Run the child after the timer is done and return its status
		return this.executeChild(tick, this.child);
	}
}