import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

export interface AddToItemList {
    type: string;
    itemName: string;
}
export interface RemoveFromItemList {
    type: string;
    itemName: string;
}

export function addToItemList(itemName: string): AddToItemList {
    return {
        type: actionTypes.ADD_TO_ITEM_LIST,
        itemName: itemName
    };
}

export function removeFromItemList(itemName: string) {
    return {
        type: actionTypes.REMOVE_FROM_ITEM_LIST,
        itemName: itemName
    };
}