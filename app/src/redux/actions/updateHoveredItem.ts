import {MapTile} from '../../map/tile';
import {UPDATE_HOVERED_ITEM} from './types';

import {IItemState} from '../../entity/components';

export interface UpdateHoveredItem {
    type: UPDATE_HOVERED_ITEM;
    item: IItemState;
}

export function updateHoveredItem (
    item: IItemState
): UpdateHoveredItem {
    return {
        type: UPDATE_HOVERED_ITEM,
        item: item
    };
}