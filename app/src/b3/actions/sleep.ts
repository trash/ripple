import {b3} from '../index';
import * as Core from '../core';

export class Sleep extends Core.BaseNode {
	tick (tick: Core.Tick) {
		const agentData = tick.target;

        agentData.sleep.isSleeping = true;

		return b3.SUCCESS;
	}
}