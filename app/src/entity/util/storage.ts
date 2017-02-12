import * as _ from 'lodash';
import {Component} from '../ComponentEnum';
import {
    IPositionState,
    IItemState,
    IRenderableState,
    IStorageState
} from '../components';
import {BaseUtil} from './base';
import {IRowColumnCoordinates} from '../../interfaces';
import {MapUtil} from '../../map/map-util';
import {constants} from '../../data/constants';
import {Item} from '../../data/Item';

export class StorageUtil extends BaseUtil {
    storeItem(itemEntity: number, storageEntity: number) {
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
            itemRenderableState.shown = false;
        }
        // Update storage state
        storageState.available--;
        storageState.itemList.push(itemEntity);

        // Set item stored to point to this entity
        itemState.stored = storageEntity;
    }

    checkIfAddValid(itemState: IItemState, storageState: IStorageState): boolean {
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

    getNearestStorageEntityToTile(tile: IRowColumnCoordinates): number {
        const storageEntities = this.entityManager.getEntityIdsForComponent(
            Component.Storage
        );
        const storageTiles = storageEntities.map(
            entity => this._getStorageState(entity).tile
        );
        const nearest = MapUtil.nearestTileFromSet(tile, storageTiles);

        return storageEntities[nearest];
    }
}

export const storageUtil = new StorageUtil();