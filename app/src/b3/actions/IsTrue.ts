import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';

type CheckFunction = (tick: Tick) => boolean;

export class IsTrue extends BaseNode {
	checkFunc: CheckFunction;

	constructor (checkFunc: CheckFunction) {
		super();
		this.checkFunc = checkFunc;
	}

	tick (tick: Tick) {
		if (this.checkFunc(tick)) {
			return b3.SUCCESS;
		} else {
			return b3.FAILURE;
		}
	}
}