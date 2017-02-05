import * as _ from 'lodash';
import {Component} from '../ComponentEnum';
import {IPositionState} from '../components/position';
import {IItemState} from '../components/item';
import {IRenderableState} from '../components/renderable';
import {events} from '../../events';
import {BaseUtil} from './base';
import {IItemSearchResult, IRowColumnCoordinates, ItemProperty, IItemSearchOptions} from '../../interfaces';
import {MapUtil} from '../../map/map-util';
import {constants} from '../../data/constants';

export class ItemUtil extends BaseUtil {
    removeFromTile (id: number) {
        const positionState = this._getPositionState(id),
            itemState = this._getItemState(id),
            renderableState = this._getRenderableState(id),
            tile = positionState.tile;

        // Free up storage space
        if (itemState.stored) {
            events.emit(['storage', 'unoccupy'], tile, id);
        }

        renderableState.sprite.visible = false;
        renderableState.shown = false;
        positionState.tile = null;
    }

	getImagePath(
		itemName: string
	): string {
		return `${constants.SPRITE_PATH}items/${itemName}.png`;
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

    getByProperties (
        properties: ItemProperty[],
        town: boolean = false
    ): IItemSearchResult[] {
		const items = town ? this.getTownItems() : this.getAllItems();

		return items.filter(itemSearchResult =>
			!!_.intersection(itemSearchResult.state.properties, properties).length);
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
		searchOptions: IItemSearchOptions = {},
		cancelItemsToBeStored: boolean = false
	): IItemSearchResult {
		let nearest = null;
		let nearestDistance = Number.MAX_VALUE;
		let itemList = this.getAllItems();

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
                    itemSearchResult.state.name === itemName);
			});
		} else if (searchOptions.properties) {
			itemList = this.getByProperties(searchOptions.properties);
		}

		if (searchOptions.claimed !== undefined) {
			itemList = itemList.filter(itemSearchResult =>
				itemSearchResult.state.claimed === searchOptions.claimed);
		}

		if (searchOptions.sortBy) {
			itemList = itemList
				.filter(item => item[searchOptions.sortBy] !== undefined)
				.sort((a, b) => a[searchOptions.sortBy] - b[searchOptions.sortBy]);
		}

		for (let i = 0; i < itemList.length; i++) {
			const itemSearchResult = itemList[i];
			const tile = this._getPositionState(itemSearchResult.id).tile;
			// Skip if this item is picked up already or it's marked to be stored
			// cancelItemsToBeStored means that we *do* want items that are queued to be stored
			// or if they specify a claimed option and it's not equal
			if (!tile ||
				(!cancelItemsToBeStored && itemSearchResult.state.toBeStored)) {
				continue;
			}

			const distance = MapUtil.distanceTo(tile, start);
			if (distance < nearestDistance) {
				nearest = itemSearchResult;
				nearestDistance = distance;
			}
		}
		return nearest;
	};
}

export const itemUtil = new ItemUtil();