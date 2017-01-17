import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';

export class Sleep extends BaseNode {
	tick (tick: Tick) {
		const agentData = tick.target;

        agentData.sleep.isSleeping = true;

		return b3.SUCCESS;
	}
}