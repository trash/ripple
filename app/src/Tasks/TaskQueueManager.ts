import {events} from '../events';
import {Task} from './Task';
import {TaskQueue} from './TaskQueue';

import {BuilderTask} from './BuilderTask';
import {GathererTask} from './GathererTask';
import {WoodcutterTask} from './WoodcutterTask';
import {HaulerTask} from './HaulerTask';
import {MinerTask} from './MinerTask';
import {CarpenterTask} from './CarpenterTask';

import {Profession} from '../data/profession';

interface IProfessionTaskQueueMap {
	[key: number]: TaskQueue;
}

const professionTaskQueueMap: IProfessionTaskQueueMap = {
	[Profession.Builder]: new TaskQueue(
		'builder',
		(building: number) => {
			return new BuilderTask(building);
		}
	),
	[Profession.Gatherer]: new TaskQueue(
		'gatherer',
		(resource: number) => {
			return new GathererTask(resource);
		}
	),
	[Profession.Woodcutter]: new TaskQueue(
		'woodcutter',
		(tree: number) =>{
			return new WoodcutterTask(tree);
		}
	),
	[Profession.Citizen]: new TaskQueue(
		'citizen',
		(item: number) => {
			return new HaulerTask(item);
		}
	),
	[Profession.Miner]: new TaskQueue(
		'miner',
		(rock: number) => {
			return new MinerTask(rock);
		}
	),
	[Profession.Carpenter]: new TaskQueue(
		'carpenter',
		(item: string) => {
			return new CarpenterTask(item);
		}
	),
};

export class TaskQueueManager {
	constructor () {
		// Listen for call to get task queue
		events.on(['task-queue-manager', 'get-task-queue'], (
			taskType: number,
			callback: (taskQueue: TaskQueue
		) => void) => {
			// Call the callback passing the matching queue
			callback(this.professionTaskQueue(taskType));
		});

		// Queues up a task to create a new instance of the resource
		events.on(['task-queue-manager', 'new-task'], (
			taskType: number,
			taskTarget: number
		) => {
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
	}
	getAllTaskQueues(): TaskQueue[] {
		return Object.keys(professionTaskQueueMap)
			.map(key => professionTaskQueueMap[key]);
	}
}

export const taskQueueManager = new TaskQueueManager();
window['taskQueueManager'] = taskQueueManager;