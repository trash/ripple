import {MapTile} from '../../map/tile';
import {ADD_TO_ITEM_LIST, REMOVE_FROM_ITEM_LIST} from './types';
import {Item} from '../../data/Item';

export interface AddToItemList {
    type: ADD_TO_ITEM_LIST;
    item: Item;
    claimed: boolean;
}
export interface RemoveFromItemList {
    type: REMOVE_FROM_ITEM_LIST;
    item: Item;
    claimed: boolean;
}

export function addToItemList(item: Item, claimed: boolean): AddToItemList {
    return {
        type: ADD_TO_ITEM_LIST,
        item,
        claimed
    };
}

export function removeFromItemList(item: Item, claimed: boolean) {
    return {
        type: REMOVE_FROM_ITEM_LIST,
        item,
        claimed
    };
}