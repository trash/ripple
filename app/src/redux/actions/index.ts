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
    IHealthState,
    IHarvestableState,
    IVisitorState,
    IAgentState
} from '../../entity/components';

import {
    UPDATE_HOVER_TILE,
    UPDATE_HOVERED_AGENT,
    UPDATE_HOVERED_AGENT_LAST_EXECUTION_CHAIN,
    UPDATE_HOVERED_RESOURCE,
    UPDATE_HOVERED_ITEM,
    UPDATE_HOVERED_BUILDING,
    UPDATE_CLOCK_TIME,
    SHOW_BUILDINGS_LIST,
    ADD_TO_ITEM_LIST,
    REMOVE_FROM_ITEM_LIST,
    SHOW_DEBUG_BAR,
    SHOW_CRAFT_BAR,
    UPDATE_HOVERED_STORAGE,
    UPDATE_TOWN_GOLD,
    UPDATE_HOVERED_HEALTH,
    UPDATE_HOVERED_HARVESTABLE,
    SPAWN_AGENT
} from './types';

export interface ShowBuildingsList {
    type: SHOW_BUILDINGS_LIST;
    show: boolean;
}

export function showBuildingsList (
    show: boolean
): ShowBuildingsList {
    return {
        type: SHOW_BUILDINGS_LIST,
        show: show
    };
}

export interface ShowDebugBar {
    type: SHOW_DEBUG_BAR;
    show: boolean;
}

export function showDebugBar (
    show: boolean
): ShowDebugBar {
    return {
        type: SHOW_DEBUG_BAR,
        show: show
    };
}

export interface ShowCraftBar {
    type: SHOW_CRAFT_BAR;
    show: boolean;
}

export function showCraftBar (
    show: boolean
): ShowCraftBar {
    return {
        type: SHOW_CRAFT_BAR,
        show: show
    };
}

export interface UpdateHoveredStorage {
    type: UPDATE_HOVERED_STORAGE;
    storage: IStorageState;
}

export function updateHoveredStorage(
    storage: IStorageState
): UpdateHoveredStorage {
    return {
        type: UPDATE_HOVERED_STORAGE,
        storage: storage
    };
}

export interface UpdateTownGold {
    type: UPDATE_TOWN_GOLD;
    gold: number;
}

export function updateTownGold(
    gold: number
): UpdateTownGold {
    return {
        type: UPDATE_TOWN_GOLD,
        gold: gold
    };
}

export interface UpdateHoveredHealth {
    type: UPDATE_HOVERED_HEALTH;
    health: IHealthState;
}

export function updateHoveredHealth(
    health: IHealthState
): UpdateHoveredHealth {
    return {
        type: UPDATE_HOVERED_HEALTH,
        health: health
    }
}

export interface UpdateHoveredHarvestable {
    type: UPDATE_HOVERED_HARVESTABLE;
    harvestable: IHarvestableState;
}

export function updateHoveredHarvestable(
    harvestable: IHarvestableState
): UpdateHoveredHarvestable {
    return {
        type: UPDATE_HOVERED_HARVESTABLE,
        harvestable: harvestable
    }
}

export interface SpawnAgent {
    type: SPAWN_AGENT;
    id: number;
    agent: IAgentState;
}

export function spawnAgent(
    id: number,
    agent: IAgentState
) {
    return {
        type: SPAWN_AGENT,
        id: id,
        agent: agent
    };
}