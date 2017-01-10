import {createStore} from 'redux';
import {actionTypes} from './actions/types';

import {IAgentState} from '../entity/components/agent';
import {IHungerState} from '../entity/components/hunger';
import {IItemState} from '../entity/components/item';
import {IResourceState} from '../entity/components/resource';
import {IBuildingState} from '../entity/components/building';
import {IConstructibleState} from '../entity/components/constructible';

import {MapTile} from '../map/tile';
import {ChildStatus} from '../b3/core/child-status';

// Actions
import {UpdateClockTime} from './actions/update-clock-time';
import {UpdateHoveredAgentAction} from './actions/update-hovered-agent';
import {UpdateHoveredAgentLastExecutionChainAction} from './actions/update-hovered-agent-last-execution-chain';
import {UpdateHoveredItemAction} from './actions/update-hovered-item';
import {UpdateHoveredBuildingAction} from './actions/update-hovered-building';
import {UpdateHoveredResourceAction} from './actions/update-hovered-resource';
import {UpdateHoverTileAction} from './actions/update-hover-tile';

export interface StoreState {
    tile: MapTile;
    hoveredAgent: IAgentState;
    hoveredAgentHunger: IHungerState;
    hoveredItem: IItemState;
    hoveredResource: IResourceState;
    hoveredBuildingState: IBuildingState;
    hoveredBuildingConstructibleState: IConstructibleState;
    hoveredAgentLastExecutionChain: ChildStatus[];
    hours: number;
    days: number;
}

const initialState = {} as StoreState;
const mainReducer = (previousState = initialState, action) => {
    const newState = _.extend({}, previousState);
    if (action.type === actionTypes.UPDATE_HOVER_TILE) {
        newState.tile = (action as UpdateHoverTileAction).tile;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_AGENT) {
        const updateAction = action as UpdateHoveredAgentAction;
        newState.hoveredAgent = updateAction.agent;
        newState.hoveredAgentHunger = updateAction.hunger;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_RESOURCE) {
        newState.hoveredResource = (action as UpdateHoveredResourceAction).resource;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_ITEM) {
        newState.hoveredItem = (action as UpdateHoveredItemAction).item;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_AGENT_LAST_EXECUTION_CHAIN) {
        newState.hoveredAgentLastExecutionChain = (action as UpdateHoveredAgentLastExecutionChainAction).executionChain;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_BUILDING) {
        let updateAction = action as UpdateHoveredBuildingAction;
        newState.hoveredBuildingState = updateAction.building;
        newState.hoveredBuildingConstructibleState = updateAction.constructible;
    }
    if (action.type === actionTypes.UPDATE_CLOCK_TIME) {
        const updateAction = action as UpdateClockTime;
        newState.hours = updateAction.hours;
        newState.days = updateAction.days;
    }
    return newState;
};

export const store = createStore<StoreState>(mainReducer);