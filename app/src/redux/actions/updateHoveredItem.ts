import {MapTile} from '../../map/tile';
import {UPDATE_HOVERED_ITEM} from './types';

import {IItemState} from '../../entity/components';

export interface UpdateHoveredItem {
    type: UPDATE_HOVERED_ITEM;
    id: number;
    item: IItemState;
}

export function updateHoveredItem (
    id: number,
    item: IItemState
): UpdateHoveredItem {
    return {
        type: UPDATE_HOVERED_ITEM,
        id,
        item
    };
}