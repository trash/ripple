import * as _ from 'lodash';
import * as Immutable from 'immutable';
import {createStore} from 'redux';
import {actionTypes} from './actions/types';

import {
    IAgentState,
    IHungerState,
    ISleepState,
    IItemState,
    IResourceState,
    IBuildingState,
    IConstructibleState,
    IPositionState
} from '../entity/components';

import {IRowColumnCoordinates} from '../interfaces';
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
    ShowDebugBar
} from './actions';

export interface StoreState {
    items: Immutable.Map<string, number>;
    tile: IRowColumnCoordinates;
    hoveredAgent: IAgentState;
    hoveredAgentHunger: IHungerState;
    hoveredAgentSleep: ISleepState;
    hoveredAgentPosition: IPositionState;
    hoveredItem: IItemState;
    hoveredResource: IResourceState;
    hoveredBuildingState: IBuildingState;
    hoveredBuildingConstructibleState: IConstructibleState;
    hoveredAgentLastExecutionChain: ChildStatus[];
    hours: number;
    days: number;
    buildingsListShown: boolean;
    debugBarShown: boolean;
}

const initialState = {
    items: Immutable.Map<string, number>()
} as StoreState;
const mainReducer = (previousState = initialState, action) => {
    const newState = _.extend({}, previousState);
    if (action.type === actionTypes.UPDATE_HOVER_TILE) {
        newState.tile = (action as UpdateHoverTile).tile;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_AGENT) {
        const updateAction = action as UpdateHoveredAgent;
        newState.hoveredAgent = updateAction.agent;
        newState.hoveredAgentHunger = updateAction.hunger;
        newState.hoveredAgentSleep = updateAction.sleep;
        newState.hoveredAgentPosition = updateAction.position;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_RESOURCE) {
        newState.hoveredResource = (action as UpdateHoveredResource).resource;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_ITEM) {
        newState.hoveredItem = (action as UpdateHoveredItem).item;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_AGENT_LAST_EXECUTION_CHAIN) {
        newState.hoveredAgentLastExecutionChain = (action as UpdateHoveredAgentLastExecutionChain).executionChain;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_BUILDING) {
        let updateAction = action as UpdateHoveredBuilding;
        newState.hoveredBuildingState = updateAction.building;
        newState.hoveredBuildingConstructibleState = updateAction.constructible;
    }
    if (action.type === actionTypes.UPDATE_CLOCK_TIME) {
        const updateAction = action as UpdateClockTime;
        newState.hours = updateAction.hours;
        newState.days = updateAction.days;
    }

    if (action.type === actionTypes.SHOW_BUILDINGS_LIST) {
        const showAction = action as ShowBuildingsList;
        newState.buildingsListShown = action.show;
    }

    if (action.type === actionTypes.SHOW_DEBUG_BAR) {
        const showAction = action as ShowDebugBar;
        newState.debugBarShown = action.show;
    }

    if (action.type === actionTypes.ADD_TO_ITEM_LIST
        || action.type === actionTypes.REMOVE_FROM_ITEM_LIST
    ) {
        const itemName = (action as AddToItemList).itemName;
        const currentCount = newState.items.get(itemName) || 0;
        if (action.type === actionTypes.ADD_TO_ITEM_LIST) {
            newState.items = newState.items.set(itemName, currentCount + 1);
        } else {
            if (currentCount === 1) {
                newState.items = newState.items.remove(itemName);
            }
            newState.items = newState.items.set(itemName, currentCount - 1);
        }
    }

    return newState;
};

export const store = createStore<StoreState>(mainReducer);