import {IItemSearchResult} from './interfaces';
import {events} from './events';
import {ItemRequirementsMap} from './ItemRequirementsMap';
import {Item} from './data/Item';
import {itemUtil} from './entity/util/item';

/**
 * An object that represents all the required items for a given task/item.
 * This is for persistence.
*/
export class ItemRequirements extends ItemRequirementsMap {
	/**
	 * Adds a item to the list of gathered items of the given item type
	 *
	 * @param {Item} item A item item that has been gathered for the requirements
	 *                        and needs to be removed from the game (used).
	 */
	addToRequirements (itemSearchResult: IItemSearchResult) {
		super.addToRequirements(itemSearchResult);

		// Update the items service
		events.emit('add-item-to-requirements', itemSearchResult.id);

		// trigger appropriate sound
		events.emit(['trigger-sound', 'resourceDrop']);

		this.emit('add', itemSearchResult);
	}

	/**
	 * Pick a random (first one found) item that needs to be gathered
	 *
	 * @return {String} The name of the picked item
	 */
	pickRequiredItem (): Item {
		let itemToGather: Item;
		Array.from(this.map).some(([itemType, itemEntry]) => {
			if (itemEntry.required > itemEntry.gathered) {
				itemToGather = itemType;
				return true;
			}
		});

		return itemToGather;
	}

	/**
	 * Returns true if there are enough of the claimed items in existence
	 * for all required items.
	 *
	 * @param {Object} itemsService Reference to the items service
	 * @return {Boolean}
	 */
	claimedItemsExist (): boolean {
		// For some itemType there does not exist the proper count
		return !Array.from(this.map).some(([itemType, itemEntry]) => {
			const amountLeft = itemEntry.required - itemEntry.gathered;
			const itemName = itemUtil.getItemNameFromEnum(itemType);

			// Basically check if the required amount of item exists and
			// if it doesn't then return true
			// NOTE: make sure to take into account the amount that have already
			// been gathered
			if (!itemUtil.claimedItemCountExists(itemName, amountLeft)) {
				return true;
			}
			return false;
		});
	}
}