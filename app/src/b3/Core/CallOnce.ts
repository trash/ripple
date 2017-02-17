import {b3} from '../index';
import {Decorator,  IDecoratorOptions} from './Decorator';
import {Tick} from './Tick';
import {uniqueId} from '../../uniqueId';
import {util} from '../../util';
/**
 * The Inverter decorator inverts the result of the child, returning `SUCCESS`
 * for `FAILURE` and `FAILURE` for `SUCCESS`.
 *
 * @module b3
 * @class Inverter
 * @extends Decorator
**/
export class CallOnce extends Decorator {
	uniqueId: string;

	initialize (options: IDecoratorOptions) {
		super.initialize(options);
		this.uniqueId = uniqueId.get();
	}

	open (tick: Tick) {
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
	tick (tick: Tick) {
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