import {HarvesterTask} from './HarvesterTask';
import {Profession} from '../data/Profession';
import {StatusBubble} from '../data/StatusBubble';

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
			taskType: Profession.Woodcutter,
			bubble: StatusBubble.Mine
		}, tree);

		// Description of the woodcutting task
		this.description = `Cutting a tree down at ${this.destinationTile.column},
			${this.destinationTile.row}.`;
	}
};