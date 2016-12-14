import {b3} from '../index';
import {Decorator} from './decorator';
import {Tick} from './tick';

/**
 * Repeater is a decorator that runs the given child node until it
 * returns SUCCESS or FAILURE `maxLoop` number of times, returning
 * RUNNING each time, and then returns SUCCESS when the final SUCCESS
 * or FAILURE is returned.
 *
 * @module b3
 * @class Repeater
 * @extends Decorator
**/
export class RepeatUntilFailure extends Decorator {
	/**
	 * Tick method.
	 * @method tick
	 * @param {Tick} tick A tick instance.
	**/
	tick (tick: Tick) {
		if (!this.child) {
			return b3.ERROR;
		}

		const status = this.executeChild(tick, this.child);

		// If the node completes, we iterate the count 1
		if (status === b3.RUNNING || status === b3.SUCCESS) {
			return b3.RUNNING;
		}
		// FAILURE means we're done here
		else if (status === b3.FAILURE) {
			return b3.SUCCESS
		}
	}
}