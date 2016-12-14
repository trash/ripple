import {b3} from '../index';
import {Composite} from './composite';
import {Tick} from './tick';
import {util} from '../../util';

/**
 * MemPriority is similar to Priority node, but when a child returns a
 * `RUNNING` state, its index is recorded and in the next tick the,
 * MemPriority calls the child recorded directly, without calling previous
 * children again.
 *
 * @module b3
 * @class MemPriority
 * @extends Composite
**/
export class MemPriority extends Composite {
	/**
	 * Open method.
	 * @method open
	 * @param {b3.Tick} tick A tick instance.
	**/
	open (tick: Tick) {
		util.blackboardSet(tick, 'runningChild', 0, this.id);
	}

	/**
	 * Tick method.
	 * @method tick
	 * @param {b3.Tick} tick A tick instance.
	 * @return {Constant} A state constant.
	**/
	tick (tick: Tick) {
		const key = 'runningChild';
		const child = util.blackboardGet(tick, key, this.id);
		for (let i=child; i<this.children.length; i++) {
			const status = this.executeChild(tick, this.children[i]);

			if (status !== b3.FAILURE) {
				if (status === b3.RUNNING) {
					util.blackboardSet(tick, key, i, this.id);
				}
				return status;
			}
		}

		return b3.FAILURE;
	}
}