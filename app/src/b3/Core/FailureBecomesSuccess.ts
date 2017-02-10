import {b3} from '../index';
import * as Core from './index';
/**
 * The Inverter decorator inverts the result of the child, returning `SUCCESS`
 * for `FAILURE` and `FAILURE` for `SUCCESS`.
 *
 * @module b3
 * @class Inverter
 * @extends Decorator
**/
export class FailureBecomesSuccess extends Core.Decorator {
	/**
	 * Tick method.
	 * @method tick
	 * @param {Tick} tick A tick instance.
	 * @return {Constant} A state constant.
	**/
	tick (tick: Core.Tick) {
		if (!this.child) {
			return b3.ERROR;
		}

		const status = this.executeChild(tick, this.child);

		if (status === b3.FAILURE) {
			return b3.SUCCESS;
		}

		return status;
	}
}