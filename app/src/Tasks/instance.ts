import {b3} from '../b3';
import {util} from '../util';
import {uniqueId} from '../uniqueId';
import {Task} from './Task';
import {BehaviorTree, Blackboard} from '../b3/Core';
import {IBehaviorTreeTickTarget} from '../interfaces';

export class Instance {
	task: Task;
	id: string;
	behaviorTree: BehaviorTree;
	entity: number;
	description: string;
	options: any;

	constructor (options) {
		this.options = options || {};

		this.id = uniqueId.get();
		this.behaviorTree = this.options.behaviorTree;
		this.task = this.options.task;
		this.entity = this.options.entity;
		this.description = this.options.description;
	}

	/**
	 * If a task instance is interrupted we need to free it up the instance from the task.
	 * We need to also remove it from the current agent's actions so it can be taken by another agent.
	 *
	 * @param {ActionList} actions List of actions for agent to remove the instance from
	 */
	cancel () {
		// Call the task's cancel method
		this.task.cancel();
		// Free up teh instance from the task
		this.task.dropInstance(this);
	}

	update (
		agent: IBehaviorTreeTickTarget,
		blackboard: Blackboard
	): number {
		var status = this.behaviorTree.tick(agent, blackboard);
		if (status === b3.SUCCESS) {
			this.complete();
		}
		return status;
	}

	isReady (): boolean {
		return this.task.isReady();
	}

	isComplete (): boolean {
		return this.task.isComplete();
	}

	/**
	 * Very important, when the instance is complete check if the task is complete then call its
	 * complete func if it is
	 */
	complete () {
		this.task.complete();
	}
}