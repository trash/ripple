import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {Task} from '../../tasks/task';
import {ComponentEnum} from '../../entity/component-enum';
import {IHealthState} from '../../entity/components/health';
import {resourceUtil} from '../../entity/util/resource';

export class HarvestResource extends BaseNode {
	resourceEntityId: number;
	task: Task;

	constructor (
		resourceEntityId: number,
		task: Task
	) {
		super();
		this.resourceEntityId = resourceEntityId;
		this.task = task;
	}
	tick (tick: Tick) {
		const agentData = tick.target;

		// Calculate the citizen's contribution
		const contribution = this.task.contribute(agentData);

		// Chop the tree
		const harvested = resourceUtil.harvest(this.resourceEntityId, contribution);

		return harvested ?
			b3.SUCCESS :
			b3.RUNNING;
	}
}