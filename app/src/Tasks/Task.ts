import * as _ from 'lodash';
import {uniqueId} from '../uniqueId';
import {Instance} from './Instance';
import {util} from '../util';
import {events} from '../events';
import * as Core from '../b3/Core';
import {TaskQueue} from './TaskQueue';
import {Profession} from '../data/Profession';
import {StatusBubble} from '../data/StatusBubble';
import {IBehaviorTreeTickTarget} from '../interfaces';

const debouncedError = _.debounce(console.error, 1000);
const debouncedError2 = _.debounce(console.error, 1000);

export interface ITaskOptions {
	behaviorTreeRoot?: Core.BaseNode;
	taskType: Profession;
	name: string;
	description?: string;
	effortRating?: number;
	maxInstancePool?: number;
	bubble: StatusBubble;
}

/**
* Creates a new Task object.
*
* @classdesc A task for a citizen to complete. Associated with a profession.
*
* @constructor
*/
export class Task {
	id: number;
	ready: boolean;
	name: string;
	behaviorTree: Core.BehaviorTree;
	taskType: Profession;
	contributions: {
		[key: number]: number;
	};
	bubble: StatusBubble;
	description: string;
	effortRating: number;
	instancePool: Instance[];
	completed: boolean;
	maxInstancePool: number;
	options: ITaskOptions;

	static defaults = {
		description: 'This is a generic task description.',
		effortRating: 1,
		maxInstancePool: 1,
	};

	constructor (options: ITaskOptions) {
		this.id = parseInt(uniqueId.get());

		this.options = options || {} as ITaskOptions;

		this.options = util.processOptions(this.options, Task.defaults, {
				name: true,
				taskType: true
			}
		);

		this.ready = true;

		this.name = this.options.name;

		this.behaviorTree = new Core.BehaviorTree();
		if (this.options.behaviorTreeRoot) {
			this.setBehaviorTree(this.options.behaviorTreeRoot);
		}

		this.bubble = options.bubble;

		// Generic task. This should be overwritten by subclasses
		this.taskType = this.options.taskType;
		// The contributions of citizens involved in the task
		// A map of citizen ids to contribution amounts
		this.contributions = {};
		// The description of the task to put in a menu/log
		this.description = this.options.description;

		this.maxInstancePool = this.options.maxInstancePool;

		// This is the amount of hunger added each turn while the primary action for the task is executed (update())
		this.effortRating = this.options.effortRating;

		// The list of instances of this task currently existing
		// Could maybe map these to citizens?
		this.instancePool = [];
	}

	setBehaviorTree (behaviorTree: Core.BaseNode) {
		this.behaviorTree.root = behaviorTree;
	}

	suspend () {
		console.log('this task should be suspended');
		this.ready = false;
	}

	unsuspend () {
		console.log('this task should be unsuspended');
		this.ready = true;
	}

	/**
	 * Make the citizen more hungry based on the task's effort rating
	 */
	citizenEffort (agentData: IBehaviorTreeTickTarget) {
		debouncedError('reimplement citizen effort');
		// citizen.status.hunger.value += this.effortRating;
	}

	getCitizenEffectiveness (agentData: IBehaviorTreeTickTarget) {
		debouncedError2('reimplement citizen effectiveness');
		return 1;
	}

	/**
	* Adds a contribution amount for a task for a given citizen.
	*
	* @param {Citizen} citizen The citizen who has contributed to the task.
	* @param {integer} contribution The amount contributed.
	*/
	contribute (agentData: IBehaviorTreeTickTarget): number {
		this.citizenEffort(agentData);

		// Calculate the citizen's contribution
		// let contribution: number = citizen.skills[this.taskType].level + 1;
		let contribution = 1;

		contribution *= this.getCitizenEffectiveness(agentData);

		// Initialize the citizen in the contributions map
		if (!(agentData.id in this.contributions)) {
			this.contributions[agentData.id] = 0;
		}
		this.contributions[agentData.id] += contribution;

		return contribution;
	}

	/**
	 * Stubbed method.
	 * Should return true/false depending on conditions determiend by the type of task as to whether the
	 * task is complete or not.
	 *
	 * By default it returns true.
	 *
	 * @return {Boolean} Whether or not the task is complete
	 */
	isComplete (): boolean {
		return this.completed;
	}

	isReady (): boolean {
		return this.ready;
	}

	/**
	 * If a task is cancelled, this method will be called
	 */
	cancel () {}

	/**
	 * Spawns a unique instance of a task for a given citizen.
	 * This is because certain actions (like move actions) apart of a task are unique to a citizen.
	 *
	 * @param  {Citizen} citizen The citizen who the instance is tied to.
	 * @return {Instance} The instance of the task tied to the citizen.
	 */
	spawnInstance (entity: number): Instance {
		var instance = new Instance({
			task: this,
			entity: entity,
			description: this.description,
			name: this.name,
			behaviorTree: this.behaviorTree
		});

		this.instancePool.push(instance);

		// Adding this instance makes us hit capacity for citizens working on the task
		if (this.instancePool.length >= this.maxInstancePool) {
			// console.info('max capacity');
			this.removeFromQueue();
		}

		return instance;
	}

	dropInstance (instance: Instance) {
		var isntInQueue = this.instancePool.length === this.maxInstancePool;
		var index = this.instancePool.indexOf(instance);

		this.instancePool.splice(index, 1);

		// If this task was removed from the queue, put it back now that it has instances available
		if (isntInQueue) {
			this.putInQueue(true);
		}
	}


	/**
	* Handles flipping the completed flag and calling addExperience to dole out experience for the completed work.
	*
	* @param {Citizen} citizen the citizen who completed the task
	* @todo Allow multiple citizen to complete a task at once.
	*/
	complete () {
		// Flip the complete flag
		this.completed = true;
		// Add experience for the citizen's profession
		for (var id in this.contributions) {
			events.emit('get-villager', id, (citizen: number) => {
				// MAybe they died?
				if (!citizen) {
					console.log('didnt receive citizen. escaping');
					return;
				}
				var contribution = this.contributions[id];
				this.addExperience(citizen, contribution);
			});
		}
		this.removeFromQueue();
	}

	/**
	 * Crappy method for getting the task queue for a task without causing circular dependency by importing in the
	 * TaskQueueManager directly
	 *
	 * @todo The better way to do this would be to have every task created with a reference to its queue directly
	 *       But since I'm lazy and that would require a million changes to the api all over the place, this works
	 *       for now.
	 *
	 * @param {Function} callback CAllback to call passing in the task queue manager
	 */
	getTaskQueue (callback: (taskQueue: TaskQueue) => void) {
		events.emit(['task-queue-manager', 'get-task-queue'], this.taskType, callback);
	}

	/**
	* Calls the function on the queue to remove this task from it.
	*/
	removeFromQueue () {
		this.getTaskQueue(taskQueue => {
			taskQueue.removeTask(this);
		});
	}

	/**
	* Puts the task in it's corresponding queue.
	*/
	putInQueue (front?: boolean) {
		this.getTaskQueue(taskQueue => {
			taskQueue.pushTask(this, front);
		});
	}

	/**
	* Handles adding experience to the citizen for completing the task.
	*
	* @param {Citizen} citizen The citizen to add experience to.
	* @param {integer} contribution The amount of work contributed by the citizen.
	*/
	addExperience (villager: number, contribution: number) {
		// citizen.addExperience(this.taskType, contribution);
		console.info('reimplement villager experience')
	}
}