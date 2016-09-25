import {b3} from '../index';
import {Tick} from './tick';
import {Decorator} from './decorator';
import {uniqueId} from '../../core/unique-id';
/**
 * The Inverter decorator inverts the result of the child, returning `SUCCESS`
 * for `FAILURE` and `FAILURE` for `SUCCESS`.
 *
 * @module b3
 * @class Inverter
 * @extends Decorator
**/
export let CallOnce = b3.Class(Decorator, {

	/**
	 * Node name. Default to `Inverter`.
	 * @property {String} name
	 * @readonly
	**/
	name: 'CallOnce',

	initialize: function () {
		Decorator.prototype.initialize.apply(this, arguments);
		this.uniqueId = uniqueId.get();
	},

	open: function(tick: Tick) {
		if (!tick.blackboard.get('calledOnce', tick.tree.id, this.uniqueId)) {
			tick.blackboard.set('calledOnce', false, tick.tree.id, this.uniqueId);
		}
	},

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

		if (!tick.blackboard.get('calledOnce', tick.tree.id, this.uniqueId)) {
			tick.blackboard.set('calledOnce', true, tick.tree.id, this.uniqueId);
			return this.child._execute(tick);
		}
		return b3.SUCCESS;
	}
});