import * as Immutable from 'immutable';
import {
	IItemRequirementsMapEntry,
	RequiredItems,
	IItemSearchResult
} from './interfaces';
import {EventEmitter2} from 'eventemitter2';
import {Item} from './data/Item';

type ForEachCallback = (
	itemType: string,
	itemEntry: IItemRequirementsMapEntry
) => void;

/**
* An object that represents all the required items for a given task/item.
* This is for non persistent item tracking.
*
* @constructor
* @param {object} items An map of item names and the amount required
*                           i.e. { wood: 10, stone: 5 }
*/
export class ItemRequirementsMap extends EventEmitter2 {
	protected map: Map<Item, IItemRequirementsMapEntry>;

	constructor (items: RequiredItems) {
		super();
		this.map = new Map();

		items.forEach(item => {
			this.map.set(item.enum, {
				gathered: 0,
				required: item.count
			});
		});
	}

	/**
	 * Updates the map based on the given item list. This is useful for temporary
	 * calculating of item requirements that don't need persistence.
	 * @param itemList
	 */
	setItemList(itemList: Immutable.Map<Item, number>): void {
		itemList.forEach((count, item) => {
			const entry = this.map.get(item);
			if (entry) {
				entry.gathered = Math.min(count, entry.required);
				this.map.set(item, entry);
			}
		});
	}

	getRequiredCountMap(): Map<Item, number> {
		const countMap = new Map<Item, number>();
		Array.from(this.map).forEach(([itemType, itemEntry]) => {
			countMap.set(itemType, itemEntry.required);
		});
		return countMap;
	}

	/**
	 * Checks whether or not the given item list contains the amount of items
	 * necessary to complete the ResourceRequirements object.
	 * @param itemList Map of items to count of that item
	 */
	itemListContainsRequiredResources(itemList: Immutable.Map<Item, number>): boolean {
		return Array.from(this.map).every(([itemType, itemEntry]) => {
			return itemList.get(itemType) + itemEntry.gathered >= itemEntry.required;
		});
	}

	isCompleted(): boolean {
		// There doesn't exist some entry where the gathered amount is not the
		// required amount
		return !Array.from(this.map).some(([itemType, itemEntry]) => {
			return itemEntry.gathered < itemEntry.required;
		});
	}

	toString(): string {
		let string = '';
		this.map.forEach((itemEntry, itemType) => {
			const itemName = Item[itemType];
			string += `${itemName}:[${itemEntry.gathered}/${itemEntry.required}] `;
		});
		return string;
	}

	/**
	 * Method to set all items as collected. For use when a building is
	 * spawned as already completed.
	 */
	markAsCompleted(): void {
		this.map.forEach(itemEntry => {
			itemEntry.gathered = itemEntry.required;
		});
	}

	/**
	 * Adds a item to the list of gathered items of the given item type
	 *
	 * @param {Item} item A item item that has been gathered for the requirements
	 *                        and needs to be removed from the game (used).
	 */
	addToRequirements (itemSearchResult: IItemSearchResult) {
		// Update our gathered amount
		this.map.get(itemSearchResult.state.enum).gathered += 1;
	}

	/**
	 * Returns the total required items left to be gathered across all types.
	 *
	 * @return {Number} The number of items left to be gathered.
	 */
	totalRequiredResources () {
		let total = 0;
		this.map.forEach((itemEntry) => {
			total += itemEntry.required - itemEntry.gathered;
		});
		return total;
	}

	/**
	 * The total amount of items that are required to have this be built.
	 * Compared with `totalRequiredResources` to tell if you're done.
	 */
	totalNeededResources () {
		let total = 0;
		this.map.forEach((itemEntry) => {
			total += itemEntry.required;
		});
		return total;
	}

	/**
	 * Returns the count of different types of items. I.e. if wood and stone then 2
	 *
	 * @return {Number} Number of different ttypes of items required
	 */
	itemTypeCount () {
		return Object.keys(this.map).length;
	}
}