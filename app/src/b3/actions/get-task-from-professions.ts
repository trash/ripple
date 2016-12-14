import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';

export class GetTaskFromProfessions extends BaseNode {
	blackboardKey: string;
	constructor (blackboardKey: string) {
		super();
		this.blackboardKey = blackboardKey;
	}
	tick (tick: Tick) {
		const agent = tick.target;
		const task = tick.target.villager.currentTask;
		if (task) {
			util.blackboardSet(tick, this.blackboardKey, task);
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}