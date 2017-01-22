import {HarvesterTask} from './HarvesterTask';
import {Professions} from '../data/professions';
import {StatusBubble} from '../data/statusBubble';

/**
* Creates a new WoodcutterTask object.
*
* @classdesc A task associated with a tree to be cut down.
*
* @extends {HarvesterTask}
*
* @constructor
* @param {Tree} tree The tree that the woodcutter must cut for this task.
*/
export class WoodcutterTask extends HarvesterTask {
	constructor (tree: number) {
		super({
			name: 'woodcutter-task',
			taskType: Professions.Woodcutter,
			bubble: StatusBubble.Mine
		}, tree);

		// Description of the woodcutting task
		this.description = `Cutting a tree down at ${this.destinationTile.column},
			${this.destinationTile.row}.`;
	}
};