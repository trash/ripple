export {actionTypes} from './types';
export {updateClockTime, UpdateClockTime} from './updateClockTime';
export {updateHoverTile, UpdateHoverTile} from './updateHoverTile';
export {updateHoveredAgent, UpdateHoveredAgent} from './updateHoveredAgent';
export {
    updateHoveredAgentLastExecutionChain,
    UpdateHoveredAgentLastExecutionChain
} from './updateHoveredAgentLastExecutionChain';
export {updateHoveredBuilding, UpdateHoveredBuilding} from './updateHoveredBuilding';
export {updateHoveredItem, UpdateHoveredItem} from './updateHoveredItem';
export {updateHoveredResource, UpdateHoveredResource} from './updateHoveredResource';
export {
    addToItemList,
    removeFromItemList,
    AddToItemList,
    RemoveFromItemList
} from './updateItemList';

import {actionTypes} from './types';

export interface ShowBuildingsList {
    type: string;
    show: boolean;
}

export function showBuildingsList (
    show: boolean
): ShowBuildingsList {
    return {
        type: actionTypes.SHOW_BUILDINGS_LIST,
        show: show
    };
}