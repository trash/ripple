import {HarvesterTask} from './harvester-task';
import {professions} from '../data/professions';

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
export class GathererTask extends HarvesterTask {
	constructor (resource) {
		super({
			name: 'gatherer-task',
			taskType: professions.gatherer,
			bubble: 'gather'
		}, resource);

		// Description of the woodcutting task
		this.description = 'Gathering a resource at ' + this.destinationTile.column + ',' + this.destinationTile.row + '.';
	}
};