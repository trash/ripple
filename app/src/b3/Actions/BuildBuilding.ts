import {events} from '../../events';
import {b3} from '../index';
import * as Core from '../Core';
import {IHealthState} from '../../entity/components/health';
import {Task} from '../../Tasks/Task';

export class BuildBuilding extends Core.BaseNode {
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

	tick (tick: Core.Tick) {
		const agentData = tick.target;
		// The amount of work the citizen will contribute is equivalent to his level right now
		const contribution = this.task.contribute(agentData);
		// Add it to the health of the building
		// this.building.updateProgress(contribution);
		this.buildingHealthState.currentHealth += contribution;

		events.emit(['trigger-sound', 'construct']);

		if (this.buildingHealthState.currentHealth >= this.buildingHealthState.maxHealth) {
			return b3.SUCCESS;
		}
		return b3.RUNNING;
	}
}