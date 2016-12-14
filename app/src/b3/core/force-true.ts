import {b3} from '../index';
import {Decorator} from './decorator';
import {Tick} from './tick';

/**
 * The Inverter decorator inverts the result of the child, returning `SUCCESS`
 * for `FAILURE` and `FAILURE` for `SUCCESS`.
 *
 * @module b3
 * @class Inverter
 * @extends Decorator
**/
export class ForceTrue extends Decorator {
	/**
	 * Tick method.
	 * @method tick
	 * @param {Tick} tick A tick instance.
	 * @return {Constant} A state constant.
	**/
	tick (tick: Tick) {
		if (!this.child) {
			return b3.ERROR;
		}

		return b3.SUCCESS;
	}
}