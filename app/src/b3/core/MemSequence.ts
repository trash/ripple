import {b3} from '../index';
import {util} from '../../util';
import * as Core from './index';

/**
 * MemSequence is similar to Sequence node, but when a child returns a
 * `RUNNING` state, its index is recorded and in the next tick the
 * MemPriority call the child recorded directly, without calling previous
 * children again.
 *
 * @module b3
 * @class MemPriority
 * @extends Composite
**/
export class MemSequence extends Core.Composite {
	/**
	 * Open method.
	 * @method open
	 * @param {b3.Tick} tick A tick instance.
	**/
	open (tick: Core.Tick) {
		util.blackboardSet(tick, 'runningChild', 0, this.id);
	}

	/**
	 * Tick method.
	 * @method tick
	 * @param {b3.Tick} tick A tick instance.
	 * @return {Constant} A state constant.
	**/
	tick (tick: Core.Tick) {
		const child = util.blackboardGet(tick, 'runningChild', this.id);
		for (let i = child; i < this.children.length; i++) {
			const status = this.executeChild(tick, this.children[i]);

			if (status !== b3.SUCCESS) {
				if (status === b3.RUNNING) {
					util.blackboardSet(tick, 'runningChild', i, this.id);
				}
				return status;
			}
		}

		return b3.SUCCESS;
	}
}