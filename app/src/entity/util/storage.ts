import * as _ from 'lodash';
import {Component} from '../ComponentEnum';
import {
    IPositionState,
    IItemState,
    IRenderableState,
    IStorageState
} from '../components';
import {BaseUtil} from './base';
import {renderableUtil} from './renderable';
import {IRowColumnCoordinates} from '../../interfaces';
import {MapUtil} from '../../map/map-util';
import {constants} from '../../data/constants';
import {Item} from '../../data/Item';
import {ItemProperty} from '../../data/ItemProperty';

export class StorageUtil extends BaseUtil {
    storeItem(
        itemEntity: number,
        storageEntity: number
    ): void {
        const itemState = this._getItemState(itemEntity);
        const storageState = this._getStorageState(storageEntity);
        // Check if adding the item to storage is valid
        if (!this.checkIfAddValid(itemState, storageState)) {
            console.warn('Invalid add to storage. aborting');
            return;
        }

        const itemPositionState = this._getPositionState(itemEntity);
        const itemRenderableState = this._getRenderableState(itemEntity);
        if (!storageState.tile) {
            debugger;
        }
        // Update item position
        itemPositionState.tile = storageState.tile;
        // Hide the item if necessary
        if (storageState.hideWhenStored) {
            renderableUtil.setShown(itemRenderableState, false);
        }
        // Update storage state
        storageState.available--;
        storageState.itemList.push(itemEntity);

        // Set item stored to point to this entity
        itemState.stored = storageEntity;
    }

    availableStorageToString(state: IStorageState): string {
        return `${state.total - state.available}/${state.total}`;
    }

    storageRestrictionsToString(state: IStorageState): string {
        let restrictions = '[';
        state.itemRestrictions.forEach(restriction =>
            restrictions += ItemProperty[restriction]
        );
        restrictions += ']';
        return restrictions;
    }

    getStorageStateFromItem(
        item: number
    ): IStorageState {
        const storage = this._getItemState(item).stored;
        if (!_.isNumber(storage)) {
			debugger;
		}
        return this._getStorageState(storage);
    }

    checkIfAddValid(
        itemState: IItemState,
        storageState: IStorageState
    ): boolean {
        if (!storageState.available) {
            return false;
        }
        // Either it doesn't have restrictions so it can store any item OR one
        // of the items properties matches the list of allowed properties
        return !storageState.itemRestrictions
            || !!_.intersection(
                    storageState.itemRestrictions,
                    itemState.properties
                ).length;
    }

    getNearestStorageEntityToTile(
        itemEntity: number,
        tile: IRowColumnCoordinates
    ): number {
        const itemState = this._getItemState(itemEntity);
        const storageEntities = this.entityManager.getEntityIdsForComponent(
            Component.Storage
        ).filter(entity => {
            const storageState = this._getStorageState(entity);
            return this.checkIfAddValid(itemState, storageState);
        });
        const storageTiles = storageEntities.map(
            entity => this._getStorageState(entity).tile
        );
        const nearest = MapUtil.nearestTileFromSet(tile, storageTiles);

        return storageEntities[nearest];
    }

    getItems(storage: number): number[] {
        return this._getStorageState(storage).itemList;
    }
}

export const storageUtil = new StorageUtil();