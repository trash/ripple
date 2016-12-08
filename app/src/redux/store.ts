import {createStore} from 'redux';
import {actionTypes} from './actions/types';
import {MapTile} from '../map/tile';

interface StoreState {
    tile: MapTile;
}

const initialState = {} as StoreState;
const mainReducer = (previousState = initialState, action) => {
    const newState = _.extend({}, previousState);
    if (action.type === actionTypes.UPDATE_HOVER_TILE) {
        newState.tile = action.tile;
    }
    return newState;
};

export const store = createStore<StoreState>(mainReducer);