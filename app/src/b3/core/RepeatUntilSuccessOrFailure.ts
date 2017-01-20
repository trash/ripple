import {b3} from '../index';
import * as Core from './index';

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
export class RepeatUntilSuccessOrFailure extends Core.Decorator {
	/**
	 * Tick method.
	 * @method tick
	 * @param {Tick} tick A tick instance.
	 **/
	tick (tick: Core.Tick) {
		if (!this.child) {
			return b3.ERROR;
		}
		const status = this.executeChild(tick, this.child);

		// If the node completes, we iterate the count 1
		if (status === b3.RUNNING) {
			return b3.RUNNING;
		}
		// FAILURE means we're done here
		else if (status === b3.FAILURE || status === b3.SUCCESS) {
			return b3.SUCCESS;
		}
	}
}