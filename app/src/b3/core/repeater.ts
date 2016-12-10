import {b3} from '../index';
import {Decorator, IDecoratorOptions} from './decorator';
import {Tick} from './tick';
import {util} from '../../util';

interface RepeaterOptions extends IDecoratorOptions {
	maxLoop?: number;
}

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
export class Repeater extends Decorator {
	maxLoop: number;

	/**
	 * Node name. Default to `Repeater`.
	 * @property {String} name
	 * @readonly
	**/
	static name = 'Repeater';

	constructor (options: RepeaterOptions) {
		super(options);
	}

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
	initialize (params: RepeaterOptions) {
		super.initialize(params);
		this.maxLoop = params.maxLoop || -1;
		this.description = 'repeat x' + this.maxLoop;
	}

	/**
	 * Open method.
	 * @method open
	 * @param {Tick} tick A tick instance.
	**/
	open (tick: Tick) {
		util.blackboardSet(tick, 'i', 0, this.id);
	}

	/**
	 * Tick method.
	 * @method tick
	 * @param {Tick} tick A tick instance.
	**/
	tick (tick: Tick) {
		if (!this.child) {
			return b3.ERROR;
		}

		let i = util.blackboardGet(tick, 'i', this.id);

		const status = this.child._execute(tick);

		// If the node completes, we iterate the count 1
		if (status == b3.SUCCESS || status == b3.FAILURE) {
			i++;
		}

		// if we hit our max count, we're done
		if (i === this.maxLoop) {
			return b3.SUCCESS;
		}

		util.blackboardSet(tick, 'i', i, this.id);
		return b3.RUNNING;
	}
}