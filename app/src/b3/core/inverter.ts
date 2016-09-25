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
export let Inverter = b3.Class(Decorator, {

	/**
	 * Node name. Default to `Inverter`.
	 * @property {String} name
	 * @readonly
	**/
	name: 'Inverter',

	/**
	 * Tick method.
	 * @method tick
	 * @param {Tick} tick A tick instance.
	 * @return {Constant} A state constant.
	**/
	tick: function(tick: Tick) {
		if (!this.child) {
			return b3.ERROR;
		}

		var status = this.child._execute(tick);

		if (status == b3.SUCCESS) {
			status = b3.FAILURE;
		} else if (status == b3.FAILURE) {
			status = b3.SUCCESS;
		}

		return status;
	}
});