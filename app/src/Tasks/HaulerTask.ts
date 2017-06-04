import * as _ from 'lodash';
import {IItemState} from '../entity/components';
import {Task} from './Task';
import * as Tasks from '../b3/Actions/Tasks';
import {Profession} from '../data/Profession';
import {StatusBubble} from '../data/StatusBubble';
import {storageUtil, positionUtil, itemUtil, agentUtil} from '../entity/util';

/**
 * A task associated with moving an item to a new location.
 * By default this task deals with moving items to storage automatically.
 * A building's entity id can be passed in optionally so that the item will be
 * brought to that building instead of being selected automatically.
 */
export class HaulerTask extends Task {
	item: number;
	shop: boolean;

	constructor (item: number, shop?: number) {
		super({
			name: 'hauler-task',
			taskType: Profession.Hauler,
			behaviorTreeRoot: new Tasks.HaulerTask(item, !!shop),
			bubble: StatusBubble.Torch,
			maxInstancePool: 1
		});

		this.item = item;
		this.shop = !!shop;

		const itemState = itemUtil._getItemState(item);
		if (itemState.haulerTask) {
			console.error('we need to cancel this hauler task?');
			this.complete();
			return;
		}
		itemState.haulerTask = this.id;

		const nearest = shop
			? shop
			: storageUtil.getNearestStorageEntityToTile(
				item,
				positionUtil.getTileFromEntityId(item)
			);

        if (!_.isNumber(nearest)) {
			console.warn('No storage location for item. Cancelling hauler task.');
			this.complete(itemState);
        }
	}
	// We need to drop the item being hauled if cancelled
	cancel (entity: number) {
		console.info('drop item being held');
		agentUtil.dropItem(entity, this.item);
		// Reset the behavior tree for the task
		this.setBehaviorTree(new Tasks.HaulerTask(this.item, this.shop));
	}

	complete (itemState?: IItemState) {
		super.complete();
		if (itemState) {
			itemState.haulerTask = null;
		}
	}
}