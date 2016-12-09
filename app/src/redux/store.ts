import {createStore} from 'redux';
import {actionTypes} from './actions/types';

import {MapTile} from '../map/tile';

// Actions
import {UpdateHoveredAgentNameAction} from './actions/update-hovered-agent-name';
import {UpdateHoverTileAction} from './actions/update-hover-tile';

export interface StoreState {
    tile: MapTile;
    hoveredAgentName: string;
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
    return newState;
};

export const store = createStore<StoreState>(mainReducer);