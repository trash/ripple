import {MapTile} from '../../map/tile';
import {ADD_TO_ITEM_LIST, REMOVE_FROM_ITEM_LIST, UNCLAIM_ITEM} from './types';
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
export interface UnclaimItem {
    type: UNCLAIM_ITEM;
    item: Item;
    claimed: true;
}

export function addToItemList(item: Item, claimed: boolean): AddToItemList {
    return {
        type: ADD_TO_ITEM_LIST,
        item,
        claimed
    };
}

export function removeFromItemList(item: Item, claimed: boolean): RemoveFromItemList {
    return {
        type: REMOVE_FROM_ITEM_LIST,
        item,
        claimed
    };
}

export function unclaimItem(item: Item): UnclaimItem {
    return {
        type: UNCLAIM_ITEM,
        item,
        claimed: true
    };
}