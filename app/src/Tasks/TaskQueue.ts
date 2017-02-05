import {Task} from './Task';
import {Instance} from './Instance';

/**
* Creates a new TaskQueue object.
*
* @classdesc A queue of Tasks for a citizen to get a job if they're idle.
*
* @constructor
*/
export class TaskQueue {
	type: string;
	tasks: Task[];
	createTask: (...any) => Task;

	constructor (
		type: string,
		createTask: (...any) => Task
	) {
		this.type = type;
		this.createTask = createTask;

		this.tasks = [];
	}

	/**
	* Pushes a new task to the queue. Creates a new task if it isn't already a task.
	*
	* @param {Task} task The task to push to the queue
	*/
	push (
		taskOrTaskItem: Task | any,
		front: boolean = false
	): Task {
		let newTask = taskOrTaskItem;
		if (!(taskOrTaskItem instanceof Task)) {
			newTask = this.createTask(taskOrTaskItem);
		}
		if (front) {
			this.tasks.unshift(newTask);
		} else {
			this.tasks.push(newTask);
		}
		return newTask;
	};

	/**
	* Removes a task from the queue if it exists.
	*
	* @param {Task} task The task to remove from the queue.
	* @returns {integer} Returns -1 if it doesn't exist, and the index if it does.
	*/
	removeTask (task: Task): number {
		const index = this.tasks.indexOf(task);
		if (index !== -1) {
			this.tasks.splice(index, 1);
		}
		return index;
	};

	/**
	* Returns the next Task from the queue. (LILO)
	* @param { Citizen } citizen The citizen who is getting the task;
	* @returns {Task} the next in the queue
	*/
	getTask (entity: number): Instance {
		const nextTask = this.getReadyTasks()[0];
		let instance: Instance;
		if (nextTask) {
			instance = nextTask.spawnInstance(entity);
		}
		return instance;
	};

	getReadyTasks (): Task[] {
		return this.tasks.filter(task => task.ready);
	};

	/**
	 * Return true when the task queue has a task that's not queued
	 */
	hasTask (): boolean {
		return !!this.getReadyTasks().length;
	};
};