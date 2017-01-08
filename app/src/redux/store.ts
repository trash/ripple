import {createStore} from 'redux';
import {actionTypes} from './actions/types';

import {IBuildingState} from '../entity/components/building';
import {IConstructibleState} from '../entity/components/constructible';

import {MapTile} from '../map/tile';
import {ChildStatus} from '../b3/core/child-status';

// Actions
import {UpdateHoveredAgentNameAction} from './actions/update-hovered-agent-name';
import {UpdateHoveredAgentLastExecutionChainAction} from './actions/update-hovered-agent-last-execution-chain';
import {UpdateHoveredItemNameAction} from './actions/update-hovered-item-name';
import {UpdateHoveredBuildingAction} from './actions/update-hovered-building';
import {UpdateHoveredResourceNameAction} from './actions/update-hovered-resource-name';
import {UpdateHoverTileAction} from './actions/update-hover-tile';

export interface StoreState {
    tile: MapTile;
    hoveredAgentName: string;
    hoveredItemName: string;
    hoveredResourceName: string;
    hoveredBuildingState: IBuildingState;
    hoveredBuildingConstructibleState: IConstructibleState;
    hoveredAgentLastExecutionChain: ChildStatus[];
}

const initialState = {} as StoreState;
const mainReducer = (previousState = initialState, action) => {
    const newState = _.extend({}, previousState);
    if (action.type === actionTypes.UPDATE_HOVER_TILE) {
        newState.tile = (action as UpdateHoverTileAction).tile;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_AGENT_NAME) {
        newState.hoveredAgentName = (action as UpdateHoveredAgentNameAction).name;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_RESOURCE_NAME) {
        newState.hoveredResourceName = (action as UpdateHoveredResourceNameAction).name;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_ITEM_NAME) {
        newState.hoveredItemName = (action as UpdateHoveredItemNameAction).name;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_AGENT_LAST_EXECUTION_CHAIN) {
        newState.hoveredAgentLastExecutionChain = (action as UpdateHoveredAgentLastExecutionChainAction).executionChain;
    }
    if (action.type === actionTypes.UPDATE_HOVERED_BUILDING) {
        let updateAction = action as UpdateHoveredBuildingAction;
        newState.hoveredBuildingState = updateAction.building;
        newState.hoveredBuildingConstructibleState = updateAction.constructible;
    }
    return newState;
};

export const store = createStore<StoreState>(mainReducer);