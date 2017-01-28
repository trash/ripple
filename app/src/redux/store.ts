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

import {MapTile} from '../map/tile';
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
} from './actions';

export interface StoreState {
    tile: MapTile;
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
}

const initialState = {} as StoreState;
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

    return newState;
};

export const store = createStore<StoreState>(mainReducer);