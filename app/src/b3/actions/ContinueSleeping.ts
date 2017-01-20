import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';

export class ContinueSleeping extends BaseNode {
	updatesCurrentAction: boolean;

	tick (tick: Tick) {
		const agentData = tick.target;

		if (agentData.sleep.isSleeping) {
			return b3.RUNNING;
		}
		return b3.FAILURE;
	}
};
