import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {IHealthState} from '../../entity/components/health';
import {Task} from '../../tasks/task';

export class BuildBuilding extends BaseNode {
	buildingHealthState: IHealthState;
	task: Task;

	constructor (
		healthState: IHealthState,
		task: Task
	) {
		super();
		this.buildingHealthState = healthState;
		this.task = task;
	}

	tick (tick: Tick) {
		const agentData = tick.target;
		// The amount of work the citizen will contribute is equivalent to his level right now
		const contribution = this.task.contribute(agentData);
		// Add it to the health of the building
		// this.building.updateProgress(contribution);
		this.buildingHealthState.currentHealth += contribution;

		if (this.buildingHealthState.currentHealth >= this.buildingHealthState.maxHealth) {
			return b3.SUCCESS;
		}
		return b3.RUNNING;
	}
}