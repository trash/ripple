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
export let Repeater = b3.Class(Decorator, {

	/**
	 * Node name. Default to `Repeater`.
	 * @property {String} name
	 * @readonly
	**/
	name: 'Repeater',

	/**
	 * Node title. Default to `Repeat XXx`. Used in Editor.
	 * @property {String} title
	 * @readonly
	**/
	title: 'Repeat <maxLoop>x',

	/**
	 * Node parameters.
	 * @property {String} parameters
	 * @readonly
	**/
	parameters: {'maxLoop': -1},

	/**
	 * Initialization method.
	 *
	 * Settings parameters:
	 *
	 * - **maxLoop** (*Integer*) Maximum number of repetitions. Default to -1
	 *                           (infinite).
	 * - **child** (*BaseNode*) The child node.
	 *
	 * @method initialize
	 * @param {Object} params Object with parameters.
	 * @constructor
	**/
	initialize: function(params) {
		Decorator.prototype.initialize.call(this, params);
		this.maxLoop = params.maxLoop || -1;
		this.description = 'repeat x' + this.maxLoop;
	},

	/**
	 * Open method.
	 * @method open
	 * @param {Tick} tick A tick instance.
	**/
	open: function(tick: Tick) {
		tick.blackboard.set('i', 0, tick.tree.id, this.id);
	},

	/**
	 * Tick method.
	 * @method tick
	 * @param {Tick} tick A tick instance.
	**/
	tick: function(tick: Tick) {
		if (!this.child) {
				return b3.ERROR;
		}

		var i = tick.blackboard.get('i', tick.tree.id, this.id);
		var status = b3.SUCCESS;



		status = this.child._execute(tick);

		// If the node completes, we iterate the count 1
		if (status == b3.SUCCESS || status == b3.FAILURE) {
			i++;
		}

		// if we hit our max count, we're done
		if (i === this.maxLoop) {
			return b3.SUCCESS;
		}

		tick.blackboard.set('i', i, tick.tree.id, this.id);
		return b3.RUNNING;
	}
});