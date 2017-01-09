import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

import {IItemState} from '../../entity/components/item';

export interface UpdateHoveredItemAction {
    type: string;
    item: IItemState;
}

export function updateHoveredItem (
    item: IItemState
): UpdateHoveredItemAction {
    return {
        type: actionTypes.UPDATE_HOVERED_ITEM,
        item: item
    };
}