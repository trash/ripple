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
import {
    IStorageState,
    IHealthState
} from '../../entity/components';

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

export interface ShowDebugBar {
    type: string;
    show: boolean;
}

export function showDebugBar (
    show: boolean
): ShowBuildingsList {
    return {
        type: actionTypes.SHOW_DEBUG_BAR,
        show: show
    };
}

export interface ShowCraftBar {
    type: string;
    show: boolean;
}

export function showCraftBar (
    show: boolean
): ShowBuildingsList {
    return {
        type: actionTypes.SHOW_CRAFT_BAR,
        show: show
    };
}

export interface UpdateHoveredStorage {
    type: string;
    storage: IStorageState;
}

export function updateHoveredStorage(
    storage: IStorageState
): UpdateHoveredStorage {
    return {
        type: actionTypes.UPDATE_HOVERED_STORAGE,
        storage: storage
    };
}

export interface UpdateTownGold {
    type: string;
    gold: number;
}

export function updateTownGold(
    gold: number
): UpdateTownGold {
    return {
        type: actionTypes.UPDATE_TOWN_GOLD,
        gold: gold
    };
}

export type UpdateHoveredHealth = {
    type: string;
    health: IHealthState;
}

export function updateHoveredHealth(
    health: IHealthState
): UpdateHoveredHealth {
    return {
        type: actionTypes.UPDATE_HOVERED_HEALTH,
        health: health
    }
}