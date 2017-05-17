import * as _ from 'lodash';
import {Component} from '../ComponentEnum';
import {
    IPositionState,
    IItemState,
    IRenderableState,
    IStorageState,
    IShopState
} from '../components';
import {StorageUtil, BaseStorageUtil} from './storage';
import {renderableUtil, itemUtil} from './';
import {IRowColumnCoordinates} from '../../interfaces';
import {MapUtil} from '../../map/map-util';
import {constants} from '../../data/constants';
import {Item} from '../../data/Item';
import {ItemProperty} from '../../data/ItemProperty';

export class ShopUtil extends BaseStorageUtil<IShopState> {
    getStorageState(entity: number): IShopState {
        return this._getShopState(entity);
    }
}

export const shopUtil = new ShopUtil();