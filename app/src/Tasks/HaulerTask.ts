import * as _ from 'lodash';
import {Task} from './Task';
import * as Tasks from '../b3/Actions/Tasks';
import {Profession} from '../data/Profession';
import {StatusBubble} from '../data/StatusBubble';
import {storageUtil, positionUtil} from '../entity/util';

/**
* Creates a new HaulerTask object.
*
* @classdesc A task associated with moving an item to a new location.
*            By default this task deals with moving items to storage automatically.
*            If dropOffLocation is passed, then this action is not to move an item
*            to storage but just move it to a new general location.
*
* @extends {Task}
*
* @constructor
* @param {Item} item The item to be hauled.
* @param {Tile} [dropOffLocation] Explicit location where to bring the item
*/
export class HaulerTask extends Task {
	constructor (item: number) {
		// Call our parent constructor
		super({
			name: 'hauler-task',
			taskType: Profession.Hauler,
			behaviorTree: new Tasks.HaulerTask(item),
			bubble: StatusBubble.Sad,
			maxInstancePool: 1
		});

		const nearest = storageUtil.getNearestStorageEntityToTile(
            item,
			positionUtil.getTileFromEntityId(item)
        );

        if (!_.isNumber(nearest)) {
			console.warn('No storage location for item. Cancelling hauler task.');
			this.complete();
        }
	}
	// We need to drop the item being hauled if cancelled
	cancel () {
		// The item is being held
		// if (this.item.citizen) {
			// this.item.citizen.dropItem(this.item);
		// }
	};

	complete () {
		super.complete();
		// this.item.haulerTask = null;
	};
};