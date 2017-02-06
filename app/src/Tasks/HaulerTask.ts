import {Task} from './Task';
// import {storage} from '../services/storage';
import * as Tasks from '../b3/actions/Tasks';
import {MapTile} from '../map/tile';
import {Profession} from '../data/profession';
import {StatusBubble} from '../data/StatusBubble';

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
	item: number;
	toStorage: boolean;
	destinationTile: MapTile;
	dropOffLocation: MapTile;

	constructor (item: number, dropOffLocation?: MapTile) {
		let noDropOffLocation = !dropOffLocation;

		// If no dropOffLocation is defined then this is being stored
		// if (noDropOffLocation) {
		// 	// Find the nearest stockpile at task creation
		// 	var stockpile = storage.getNearestStockpileForItem(item);
		// 	dropOffLocation = stockpile.tile;
		// 	// Make sure to 'claim' the stockpile
		// 	storage.occupyStockpileByTile(dropOffLocation, item);
		// }

		// Call our parent constructor
		super({
			name: 'hauler-task',
			taskType: Profession.Citizen,
			behaviorTree: new Tasks.HaulerTask(item, dropOffLocation),
			bubble: StatusBubble.Sad
		});

		if (noDropOffLocation) {
			this.toStorage = true;
		}

		this.item = item;
		// Make sure to mark the item as being moved to be stored
		// this.item.setToBeStored(true);
		// this.item.haulerTask = this;

		// By default this task does not mean an item is moving to storage
		this.toStorage = false;

		// only one person can haul an item
		this.maxInstancePool = 1;

		// this.destinationTile = item.tile;
		// this.description = 'Hauling a ' + this.item.name + ' at ' + this.destinationTile.column + ',' + this.destinationTile.row + '.';

		this.dropOffLocation = dropOffLocation;
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