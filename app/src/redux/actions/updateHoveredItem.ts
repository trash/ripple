import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

import {IItemState} from '../../entity/components';

export interface UpdateHoveredItem {
    type: string;
    item: IItemState;
}

export function updateHoveredItem (
    item: IItemState
): UpdateHoveredItem {
    return {
        type: actionTypes.UPDATE_HOVERED_ITEM,
        item: item
    };
}