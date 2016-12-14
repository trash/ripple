import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';
import {Instance} from '../../tasks/instance';

export class DoCurrentTask extends BaseNode {
	updatesCurrentAction: boolean;
	blackboardKey: string;

	constructor (blackboardKey: string) {
		super();
		this.updatesCurrentAction = true;
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Tick) {
		const entityData = tick.target;
		const taskInstance = entityData.villager.currentTask;
		if (!taskInstance) {
			return b3.FAILURE;
		}

		this.description = taskInstance.description;

		const status = taskInstance.update(entityData.id, entityData.behaviorTree.blackboard);
		if (status) {
			return status;
		}
		if (taskInstance.isComplete()) {
			return b3.SUCCESS;
		}
		return b3.RUNNING;
	}

	close (tick: Tick) {
		const entityData = tick.target
		const currentTask = entityData.villager.currentTask;
		// Already called once
		if (!currentTask) {
			return;
		}
		// Clean up incomplete task
		if (!currentTask.isComplete()) {
			currentTask.cancel();
		}
	}
}