import {MapTile} from '../../map/tile';
import {ADD_TO_ITEM_LIST, REMOVE_FROM_ITEM_LIST} from './types';
import {Item} from '../../data/Item';

export interface AddToItemList {
    type: ADD_TO_ITEM_LIST;
    item: Item;
}
export interface RemoveFromItemList {
    type: REMOVE_FROM_ITEM_LIST;
    item: Item;
}

export function addToItemList(item: Item): AddToItemList {
    return {
        type: ADD_TO_ITEM_LIST,
        item: item
    };
}

export function removeFromItemList(item: Item) {
    return {
        type: REMOVE_FROM_ITEM_LIST,
        item: item
    };
}