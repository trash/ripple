import {b3} from '../index';
import * as Core from './index';
import {uniqueId} from '../../unique-id';
import {util} from '../../util';
/**
 * The Inverter decorator inverts the result of the child, returning `SUCCESS`
 * for `FAILURE` and `FAILURE` for `SUCCESS`.
 *
 * @module b3
 * @class Inverter
 * @extends Decorator
**/
export class CallOnce extends Core.Decorator {
	uniqueId: string;

	initialize (options: Core.IDecoratorOptions) {
		super.initialize(options);
		this.uniqueId = uniqueId.get();
	}

	open (tick: Core.Tick) {
		const key = 'calledOnce';
		if (util.blackboardGet(tick, key, this.uniqueId)) {
			util.blackboardSet(tick, key, false, this.uniqueId);
		}
	}

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

		const key = 'calledOnce';
		if (!util.blackboardGet(tick, key, this.uniqueId)) {
			util.blackboardSet(tick, key, true, this.uniqueId);
			return this.executeChild(tick, this.child);
		}
		return b3.SUCCESS;
	}
};