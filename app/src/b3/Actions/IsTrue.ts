import {b3} from '../index';
import * as Core from '../Core';

type CheckFunction = (tick: Core.Tick) => boolean;

export class IsTrue extends Core.BaseNode {
	checkFunc: CheckFunction;

	constructor (checkFunc: CheckFunction) {
		super();
		this.checkFunc = checkFunc;
	}

	tick (tick: Core.Tick) {
		if (this.checkFunc(tick)) {
			return b3.SUCCESS;
		} else {
			return b3.FAILURE;
		}
	}
}