import * as _ from 'lodash';
import * as changeCase from 'change-case';
import {store} from '../../redux/store';
import {unclaimItem} from '../../redux/actions';
import {ItemRequirementsMap} from '../../ItemRequirementsMap';
import {Component} from '../ComponentEnum';
import {IPositionState} from '../components/position';
import {IItemState} from '../components/item';
import {IRenderableState} from '../components/renderable';
import {events} from '../../events';
import {BaseUtil} from './base';
import {renderableUtil} from './renderable';
import {
	IItemSearchResult,
	IRowColumnCoordinates,
	ItemSearchOptions
} from '../../interfaces';
import {MapUtil} from '../../map/map-util';
import {constants} from '../../data/constants';
import {Item} from '../../data/Item';
import {ItemProperty} from '../../data/ItemProperty';

export class ItemUtil extends BaseUtil {
    removeFromTile (id: number) {
        const positionState = this._getPositionState(id);
        const itemState = this._getItemState(id);
        const renderableState = this._getRenderableState(id);
        const tile = positionState.tile;

        // Free up storage space
        if (itemState.stored !== null) {
            events.emit(['storage', 'unoccupy'], tile, id);
        }

		renderableUtil.setShown(renderableState, false);
        positionState.tile = null;
    }

	getItemSearchResultFromItem(
		item: number
	): IItemSearchResult {
		return {
			state: this._getItemState(item),
			position: this._getPositionState(item),
			id: item
		};
	}

	getItemNameFromEnum(
		item: Item
	): string {
		return changeCase.paramCase(Item[item]);
	}

	getImagePath(
		item: Item
	): string {
		const itemName = this.getItemNameFromEnum(item);
		return `${constants.SPRITE_PATH}items/${itemName}.png`;
	}

	itemListToString(items: number[]): string {
		const itemNames = items.map(id => this.getItemNameFromEnum(this._getItemState(id).enum));
		const countMap = new Map<string, number>();
		itemNames.forEach(name => {
			if (!countMap.get(name)) {
				countMap.set(name, 0);
			}
			const count = countMap.get(name);
			countMap.set(name, count + 1);
		});

		return Array.from(countMap).reduce((previous, [currentItem, currentCount]) => {
			return previous + `${currentItem} (${currentCount}) `;
		}, '').trim();
	}

	private idToItemSearchResult (id: number): IItemSearchResult {
		return {
			id: id,
			state: this._getItemState(id),
			position: this._getPositionState(id)
		};
	}

    getAllItems (): IItemSearchResult[] {
        return this.entityManager
            .getEntityIdsForComponent(Component.Item)
            .map(id => this.idToItemSearchResult(id));
    }

    getTownItems (): IItemSearchResult[] {
		return this.getAllItems()
            .filter(itemSearchResult => itemSearchResult.state.claimed);
	}

	pickupItem(item: number) {
		const itemState = this._getItemState(item);
		itemState.claimed = false;
		itemState.forSale = false;
		const positionState = this._getPositionState(item);
		positionState.tile = null;
	}

    getByProperties (
        properties: ItemProperty[],
        town: boolean = false
    ): IItemSearchResult[] {
		const items = town ? this.getTownItems() : this.getAllItems();

		return items.filter(itemSearchResult =>
			!!_.intersection(itemSearchResult.state.properties, properties).length);
	}

	getByName (name: string): IItemSearchResult[] {
		return this.getAllItems().filter(item => item.state.name === name);
	}

	/**
	 * Returns true if at least one of the resource with the given name
	 * exists and is claimed.
	 *
	 * @param {String} itemName
	 * @param {Number} [count] Number of resources to check for
	 * @return {Boolean}
	 */
	claimedItemCountExists (
		itemName: string,
		count?: number
	): boolean {
		if (count === 0) {
			return true;
		}
		const length = this.getByName(itemName)
			.filter(itemSearchResult => itemSearchResult.state.claimed)
			.length;
		if (!count) {
			return !!length;
		}
		return length >= count;
	}

	private getItemListFromSearchOptions(searchOptions: ItemSearchOptions): IItemSearchResult[] {
		let itemList = this.getAllItems();
		if (searchOptions.itemEnums) {
			searchOptions.itemNames = searchOptions.itemEnums.map(item =>
				itemUtil.getItemNameFromEnum(item)
			);
		}

		// Filter out items with the given ids
		if (searchOptions.ignoredIds) {
			itemList = _.difference(itemList.map(entry => entry.id), searchOptions.ignoredIds)
				.map(id => this.getItemSearchResultFromItem(id));
		}

		if (searchOptions.itemNames) {
			let itemNames;
			// Handle if they just pass a single name
			if (typeof searchOptions.itemNames === 'string') {
				itemNames = [searchOptions.itemNames];
			} else if (searchOptions.itemNames instanceof Array) {
				itemNames = searchOptions.itemNames;
			}
			// Add together all the lists of items for the different requested resources
			itemNames.forEach(itemName => {
                itemList = itemList.filter(itemSearchResult =>
                    itemSearchResult.state.name === itemName
				);
			});
		} else if (searchOptions.properties) {
			itemList = this.getByProperties(searchOptions.properties);
		}

		if (searchOptions.claimed !== undefined) {
			itemList = itemList.filter(itemSearchResult =>
				itemSearchResult.state.claimed === searchOptions.claimed
			);
		}

		if (searchOptions.toBeStored !== undefined) {
			itemList = itemList.filter(itemSearchResult =>
				!!itemSearchResult.state.toBeStored === !!searchOptions.toBeStored
			);
		}

		if (searchOptions.sortBy) {
			itemList = itemList
				.filter(item => item[searchOptions.sortBy] !== undefined)
				.sort((a, b) => a[searchOptions.sortBy] - b[searchOptions.sortBy]);
		}
		return itemList;
	}

	itemExists(searchOptions: ItemSearchOptions): boolean {
		return this.getItemListFromSearchOptions(searchOptions).length > 0;
	}

	unclaim(item: number): void {
		const itemState = this._getItemState(item);
		itemState.claimed = false;
		store.dispatch(unclaimItem(itemState.enum));
	}

    /**
	 * Finds the closest of a given resource from a given tile.
	 * Returns an object with data pertaining to the found resource and it's tile OR
	 * it return false if there is no resource of this type.
	 *
	 * @param { Tile } start The tile to start the search from.
	 * @param { String | String[] } itemNames The name of the resource(s) to look for.
	 *
	 * @return { Object } closestResource The closest resource and it's location.
	 * @returns { Tile } closestResource.tile The tile that the closest resource occupies.
	 * @returns { float } closestResource.distance The distance of the resource from the start tile.
	 * @returns { Item } closestResource.item The actual item associated with the resource.
	 */
	getNearestItem (
		start: IRowColumnCoordinates,
		searchOptions: ItemSearchOptions = {},
		cancelItemsToBeStored: boolean = false
	): IItemSearchResult {
		let nearest = null;
		let nearestDistance = Number.MAX_VALUE;
		const itemList = this.getItemListFromSearchOptions(searchOptions);

		for (let i = 0; i < itemList.length; i++) {
			const itemSearchResult = itemList[i];
			const tile = this._getPositionState(itemSearchResult.id).tile;
			// Skip if this item is picked up already or it's marked to be stored
			// cancelItemsToBeStored means that we *do* want items that are queued to be stored
			// or if they specify a claimed option and it's not equal
			if (!tile
				|| (!cancelItemsToBeStored && itemSearchResult.state.toBeStored)) {
				continue;
			}

			const distance = MapUtil.distanceTo(tile, start);
			if (distance < nearestDistance) {
				nearest = itemSearchResult;
				nearestDistance = distance;
			}
		}
		return nearest;
	}

	getAllItemsForResourceRequirements(
		startTile: IRowColumnCoordinates,
		requiredResources: ItemRequirementsMap
	): number[] {
		const items: number[] = [];
		const countMap = requiredResources.getRequiredCountMap();
		Array.from(countMap).forEach(([itemType, count]) => {
			for (let i = 0; i < count; i++) {
				items.push(this.getNearestItem(startTile, {
					itemEnums: [itemType],
					ignoredIds: items
				}).id);
			}
		});
		return items;
	}
}

export const itemUtil = new ItemUtil();