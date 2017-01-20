import {events} from '../events';
import {Task} from './task';
import {TaskQueue} from './task-queue';

import {BuilderTask} from './builder-task';
import {GathererTask} from './gatherer-task';
import {WoodcutterTask} from './woodcutter-task';
import {HaulerTask} from './hauler-task';
import {MinerTask} from './miner-task';

import {Professions} from '../data/professions';

interface IProfessionTaskQueueMap {
	[key: number]: TaskQueue;
}

const professionTaskQueueMap: IProfessionTaskQueueMap = {
	[Professions.Builder]: new TaskQueue(
		'builder',
		(building: number) => {
			return new BuilderTask(building);
		}
	),
	[Professions.Gatherer]: new TaskQueue(
		'gatherer',
		(resource: number) => {
			return new GathererTask(resource);
		}
	),
	[Professions.Woodcutter]: new TaskQueue(
		'woodcutter',
		(tree: number) =>{
			return new WoodcutterTask(tree);
		}
	),
	[Professions.Citizen]: new TaskQueue(
		'citizen',
		(item: number) => {
			return new HaulerTask(item);
		}
	),
	[Professions.Miner]: new TaskQueue(
		'miner',
		(rock: number) => {
			return new MinerTask(rock);
		}
	),
};

export class TaskQueueManager {
	constructor () {
		// Listen for call to get task queue
		events.on(['task-queue-manager', 'get-task-queue'], (taskType: number, callback: (taskQueue: TaskQueue) => void) => {
			// Call the callback passing the matching queue
			callback(this.professionTaskQueue(taskType));
		});

		// Queues up a task to create a new instance of the resource
		events.on(['task-queue-manager', 'new-task'], (taskType: number, taskTarget: number) => {
			var taskQueue = this.professionTaskQueue(taskType);
			taskQueue.push(taskTarget);
		});
	}
	/**
	* Checks if a profession is mapped to a task queue and returns it or false if it doesn't have one
	* @returns {TaskQueue} the task queue associated with the given profession
	*/
	professionTaskQueue (profession: number): TaskQueue {
		if (profession in professionTaskQueueMap) {
			return professionTaskQueueMap[profession];
		}
		return null;
	};
};

export let taskQueueManager = new TaskQueueManager();
window['taskQueueManager'] = taskQueueManager;