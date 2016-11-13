import {createStore} from 'redux';
import {actionTypes} from './actions/types';

const initialState = {};
const mainReducer = (previousState = initialState, action) => {
    const newState = _.extend({}, previousState);
    if (action.type === actionTypes.UPDATE_HOVER_TILE) {
        newState.tile = action.tile;
    }
    return newState;
};

export const store = createStore(mainReducer);