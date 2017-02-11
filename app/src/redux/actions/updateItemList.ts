import {MapTile} from '../../map/tile';
import {actionTypes} from './types';
import {Item} from '../../data/Item';

export interface AddToItemList {
    type: string;
    item: Item;
}
export interface RemoveFromItemList {
    type: string;
    item: Item;
}

export function addToItemList(item: Item): AddToItemList {
    return {
        type: actionTypes.ADD_TO_ITEM_LIST,
        item: item
    };
}

export function removeFromItemList(item: Item) {
    return {
        type: actionTypes.REMOVE_FROM_ITEM_LIST,
        item: item
    };
}