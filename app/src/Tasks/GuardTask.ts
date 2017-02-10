import {Task} from './task';
import {util} from '../util';
import {GuardTask as GuardTaskAction} from '../b3/actions/tasks/GuardTask';
import {IRowColumnCoordinates} from '../interfaces';
import {Profession} from '../data/Profession';
import {StatusBubble} from '../data/StatusBubble';
/**
* Creates a new GuardTask object.
*
* @classdesc A task associated with a building to be built.
*
* @extends {Task}
*
* @constructor
* @param {Building} building The building to build for this task.
*/
export class GuardTask extends Task {
	guardTarget: number;

	constructor (guardTarget: number) {
		// Call our parent constructor
		super({
			taskType: Profession.Guard,
			name: 'guard-task',
			behaviorTree: new GuardTaskAction(guardTarget),
			effortRating: 3,
			bubble: StatusBubble.Guard
		});

		this.guardTarget = guardTarget;
		this.description = `Guarding target at somewhere.`;
	}

	/**
	 * Call the complete method on the buildign and complete the task
	 */
	complete () {
		console.log('finished guarding target');
		// Hide the build bubbles for the workers
		this.instancePool.forEach(function (instance) {
			instance.agent.hideBubble('bubble-build');
		}.bind(this));

		super.complete();
	};
};