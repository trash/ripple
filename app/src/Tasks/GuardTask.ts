import {Task} from './Task';
import {util} from '../util';
import {GuardTask as GuardTaskAction} from '../b3/Actions/tasks/GuardTask';
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
			behaviorTreeRoot: new GuardTaskAction(guardTarget),
			effortRating: 3,
			bubble: StatusBubble.Guard
		});

		this.guardTarget = guardTarget;
		this.description = `Guarding target at somewhere.`;
	}
};