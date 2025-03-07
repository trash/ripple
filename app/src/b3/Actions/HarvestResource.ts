import {b3} from '../index';
import * as Core from '../Core';
import {Task} from '../../Tasks/Task';
import {Component} from '../../entity/ComponentEnum';
import {IHealthState} from '../../entity/components';
import {harvestableUtil} from '../../entity/util';

export class HarvestResource extends Core.BaseNode {
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
	tick (tick: Core.Tick) {
		const agentData = tick.target;

		// Calculate the citizen's contribution
		const contribution = this.task.contribute(agentData);

		// Chop the tree
		const harvested = harvestableUtil.harvest(this.resourceEntityId, contribution);

		return harvested
			? b3.SUCCESS
			: b3.RUNNING;
	}
}