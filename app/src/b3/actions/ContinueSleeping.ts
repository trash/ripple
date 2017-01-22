import {b3} from '../index';
import * as Core from '../Core';

export class ContinueSleeping extends Core.BaseNode {
	updatesCurrentAction: boolean;

	tick (tick: Core.Tick) {
		const agentData = tick.target;

		if (agentData.sleep.isSleeping) {
			return b3.RUNNING;
		}
		return b3.FAILURE;
	}
};
