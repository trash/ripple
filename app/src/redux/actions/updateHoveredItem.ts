import {MapTile} from '../../map/tile';
import {UPDATE_HOVERED_ITEM} from './types';

import {IItemState, IPositionState} from '../../entity/components';

export interface UpdateHoveredItem {
    type: UPDATE_HOVERED_ITEM;
    id: number;
    item: IItemState;
    itemPosition: IPositionState;
}

export function updateHoveredItem (
    id: number,
    item: IItemState,
    itemPosition: IPositionState
): UpdateHoveredItem {
    return {
        type: UPDATE_HOVERED_ITEM,
        id,
        item,
        itemPosition
    };
}