import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

export interface UpdateHoveredItemNameAction {
    type: string;
    name: string;
}

export function updateHoveredItemName (name: string): UpdateHoveredItemNameAction {
    return {
        type: actionTypes.UPDATE_HOVERED_ITEM_NAME,
        name: name
    };
}