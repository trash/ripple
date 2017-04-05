import * as _ from 'lodash';
import * as Immutable from 'immutable';
import {createStore} from 'redux';
import * as actionTypes from './actions/types';
import {Item} from '../data/Item';
import {
    AgentListEntry,
    BuildingListEntry,
    ResourceListEntry,
    IRowColumnCoordinates
} from '../interfaces';

import {
    IAgentState,
    IHungerState,
    ISleepState,
    IItemState,
    IResourceState,
    IBuildingState,
    IConstructibleState,
    IPositionState,
    IVillagerState,
    IStorageState,
    IStatusBubbleState,
    IHealthState,
    IHarvestableState,
    IVisitorState,
    IInventoryState
} from '../entity/components';

import {ChildStatus} from '../b3/Core';

// Actions
import {
    UpdateClockTime,
    UpdateHoveredAgent,
    UpdateHoveredAgentLastExecutionChain,
    UpdateHoveredItem,
    UpdateHoveredBuilding,
    UpdateHoveredResource,
    UpdateHoverTile,
    ShowBuildingsList,
    AddToItemList,
    RemoveFromItemList,
    ShowDebugBar,
    ShowCraftBar,
    UpdateHoveredStorage,
    UpdateTownGold,
    UpdateHoveredHealth,
    UpdateHoveredHarvestable,
    SpawnAgent,
    SpawnBuilding,
    AgentListSelect,
    EntitySelected,
    PlayPauseGame,
    UpdateGameSpeed,
    SpawnResource,
    UpdateVillagerJob
} from './actions';

type ReducerAction =
    | UpdateClockTime
    | UpdateHoveredAgent
    | UpdateHoveredAgentLastExecutionChain
    | UpdateHoveredItem
    | UpdateHoveredBuilding
    | UpdateHoveredResource
    | UpdateHoverTile
    | ShowBuildingsList
    | AddToItemList
    | RemoveFromItemList
    | ShowDebugBar
    | ShowCraftBar
    | UpdateHoveredStorage
    | UpdateTownGold
    | UpdateHoveredHealth
    | UpdateHoveredHarvestable
    | SpawnAgent
    | SpawnBuilding
    | SpawnResource
    | EntitySelected
    | PlayPauseGame
    | UpdateGameSpeed
    | UpdateVillagerJob
    | AgentListSelect;

export interface StoreState {
    items: Immutable.Map<Item, number>;
    tile: IRowColumnCoordinates;
    hoveredAgent: IAgentState;
    hoveredAgentHunger: IHungerState;
    hoveredAgentSleep: ISleepState;
    hoveredAgentPosition: IPositionState;
    hoveredAgentStatusBubble: IStatusBubbleState;
    hoveredItem: IItemState;
    hoveredResource: IResourceState;
    hoveredStorage: IStorageState;
    hoveredBuildingState: IBuildingState;
    hoveredBuildingConstructibleState: IConstructibleState;
    hoveredAgentLastExecutionChain: ChildStatus[];
    hoveredVillager: IVillagerState;
    hoveredHealth: IHealthState;
    hoveredHarvestable: IHarvestableState;
    hoveredVisitor: IVisitorState;
    hoveredInventory: IInventoryState;
    hours: number;
    days: number;
    buildingsListShown: boolean;
    debugBarShown: boolean;
    craftBarShown: boolean;
    gold: number;
    agentsList: Immutable.List<AgentListEntry>;
    buildingsList: Immutable.List<BuildingListEntry>;
    resourcesList: Immutable.List<ResourceListEntry>;
    agentListSelected: number;
    selectedEntity: number;
    gameSpeed: number;
    gamePaused: boolean;
}

const initialState = {
    items: Immutable.Map<Item, number>(),
    gold: 0,
    agentsList: Immutable.List<AgentListEntry>(),
    buildingsList: Immutable.List<BuildingListEntry>(),
    resourcesList: Immutable.List<ResourceListEntry>(),
    gameSpeed: 0
} as StoreState;
function mainReducer(
    previousState = initialState,
    action: ReducerAction
) {
    const newState = _.extend({}, previousState);

    switch (action.type) {
        case actionTypes.UPDATE_HOVER_TILE:
            newState.tile = action.tile;
            break;

        case actionTypes.UPDATE_HOVERED_AGENT:
            newState.hoveredAgent = action.agent;
            newState.hoveredAgentHunger = action.hunger;
            newState.hoveredAgentSleep = action.sleep;
            newState.hoveredAgentPosition = action.position;
            newState.hoveredAgentStatusBubble = action.statusBubble;
            newState.hoveredVillager = action.villager;
            newState.hoveredVisitor = action.visitor;
            newState.hoveredInventory = action.inventory;
            break;

        case actionTypes.UPDATE_HOVERED_RESOURCE:
            newState.hoveredResource = (action as UpdateHoveredResource).resource;
            break;
        case actionTypes.UPDATE_HOVERED_ITEM:
            newState.hoveredItem = (action as UpdateHoveredItem).item;
            break;
        case actionTypes.UPDATE_HOVERED_AGENT_LAST_EXECUTION_CHAIN:
            newState.hoveredAgentLastExecutionChain = (action as UpdateHoveredAgentLastExecutionChain).executionChain;
            break;
        case actionTypes.UPDATE_HOVERED_BUILDING:
            newState.hoveredBuildingState = action.building;
            newState.hoveredBuildingConstructibleState = action.constructible;
            break;
        case actionTypes.UPDATE_CLOCK_TIME:
            newState.hours = action.hours;
            newState.days = action.days;
            break;

        case actionTypes.SHOW_BUILDINGS_LIST:
            newState.buildingsListShown = action.show;
            break;

        case actionTypes.SHOW_DEBUG_BAR:
            newState.debugBarShown = action.show;
            break;

        case actionTypes.SHOW_CRAFT_BAR:
            newState.craftBarShown = action.show;
            break;

        case actionTypes.ADD_TO_ITEM_LIST:
        case actionTypes.REMOVE_FROM_ITEM_LIST:
            const item = (action as AddToItemList).item;
            const currentCount = newState.items.get(item) || 0;
            if (action.type === actionTypes.ADD_TO_ITEM_LIST) {
                newState.items = newState.items.set(item, currentCount + 1);
            } else {
                if (currentCount === 1) {
                    newState.items = newState.items.remove(item);
                }
                newState.items = newState.items.set(item, currentCount - 1);
            }
            break;

        case actionTypes.UPDATE_HOVERED_STORAGE:
            newState.hoveredStorage = action.storage;
            break;

        case actionTypes.UPDATE_TOWN_GOLD:
            newState.gold = action.gold;
            break;

        case actionTypes.UPDATE_HOVERED_HEALTH:
            newState.hoveredHealth = action.health;
            break;

        case actionTypes.UPDATE_HOVERED_HARVESTABLE:
            newState.hoveredHarvestable = action.harvestable;
            break;

        case actionTypes.SPAWN_AGENT:
            newState.agentsList = previousState.agentsList.push({
                id: action.id,
                agent: action.agent,
                name: action.name,
                villager: action.villager,
                visitor: action.visitor,
                position: action.position,
                health: action.health,
                lastAction: action.lastAction
            });
            break;

        case actionTypes.SPAWN_BUILDING:
            newState.buildingsList = previousState.buildingsList.push({
                id: action.id,
                building: action.building,
                constructible: action.constructible,
                position: action.position,
                health: action.health,
            });
            break;

        case actionTypes.SPAWN_RESOURCE:
            newState.resourcesList = previousState.resourcesList.push({
                id: action.id,
                resource: action.resource,
                harvestable: action.harvestable,
                position: action.position,
                health: action.health,
            });
            break;

        case actionTypes.AGENT_LIST_SELECT:
            newState.agentListSelected = action.selected;
            break;

        case actionTypes.ENTITY_SELECTED:
            newState.selectedEntity = action.selected;
            break;

        case actionTypes.PLAY_PAUSE_GAME:
            newState.gamePaused = action.gamePaused;
            break;

        case actionTypes.UPDATE_GAME_SPEED:
            newState.gameSpeed = action.gameSpeed;
            break;

        case actionTypes.UPDATE_VILLAGER_JOB:
            const index = newState.agentsList
                .findIndex(entry => entry.id === action.id);
            const entry = newState.agentsList.get(index);
            const updatedEntry = _.cloneDeep(entry);
            updatedEntry.villager.job = action.job;

            newState.agentsList = newState.agentsList.set(index, updatedEntry);
            // This is kind of hack. Essentially we have to modify the original reference
            // because this is still being used by the game engine but we need
            // to pass in a new object entirely so that redux detects a state change
            // and re-renders. The solution to this would be to use immutable structs
            // for every single state object but i fear that would be a premature
            // optimization that would cause a looot of performance degradation
            entry.villager.job = action.job;
            break;
    }

    return newState;
};

export const store = createStore<StoreState>(mainReducer);