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
    IAgentState,
    IVillagerState,
    IPositionState
} from '../../entity/components';

import * as actionTypes from './types';

export interface ShowBuildingsList {
    type: actionTypes.SHOW_BUILDINGS_LIST;
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
    type: actionTypes.SHOW_DEBUG_BAR;
    show: boolean;
}

export function showDebugBar (
    show: boolean
): ShowDebugBar {
    return {
        type: actionTypes.SHOW_DEBUG_BAR,
        show: show
    };
}

export interface ShowCraftBar {
    type: actionTypes.SHOW_CRAFT_BAR;
    show: boolean;
}

export function showCraftBar (
    show: boolean
): ShowCraftBar {
    return {
        type: actionTypes.SHOW_CRAFT_BAR,
        show: show
    };
}

export interface UpdateHoveredStorage {
    type: actionTypes.UPDATE_HOVERED_STORAGE;
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
    type: actionTypes.UPDATE_TOWN_GOLD;
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

export interface UpdateHoveredHealth {
    type: actionTypes.UPDATE_HOVERED_HEALTH;
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

export interface UpdateHoveredHarvestable {
    type: actionTypes.UPDATE_HOVERED_HARVESTABLE;
    harvestable: IHarvestableState;
}

export function updateHoveredHarvestable(
    harvestable: IHarvestableState
): UpdateHoveredHarvestable {
    return {
        type: actionTypes.UPDATE_HOVERED_HARVESTABLE,
        harvestable: harvestable
    }
}

export interface SpawnAgent {
    type: actionTypes.SPAWN_AGENT;
    id: number;
    agent: IAgentState;
    villager: IVillagerState;
    visitor: IVisitorState;
    position: IPositionState;
    health: IHealthState;
    lastAction: string;
}

export function spawnAgent(
    id: number,
    agent: IAgentState,
    villager: IVillagerState,
    visitor: IVisitorState,
    position: IPositionState,
    health: IHealthState,
    lastAction: string
) {
    return {
        type: actionTypes.SPAWN_AGENT,
        id: id,
        agent: agent,
        villager: villager,
        visitor: visitor,
        position: position,
        health: health,
        lastAction: lastAction
    };
}

export interface AgentListSelect {
    type: actionTypes.AGENT_LIST_SELECT;
    selected: number;
}

export function agentListSelect(
    selected: number
) {
    return {
        type: actionTypes.AGENT_LIST_SELECT,
        selected: selected
    };
}

export interface EntitySelected {
    type: actionTypes.ENTITY_SELECTED;
    selected: number;
}

export function entitySelected(
    selected: number
) {
    return {
        type: actionTypes.ENTITY_SELECTED,
        selected: selected
    };
}