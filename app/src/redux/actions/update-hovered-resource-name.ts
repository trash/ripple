import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

export interface UpdateHoveredResourceNameAction {
    type: string;
    name: string;
}

export function updateHoveredResourceName (name: string): UpdateHoveredResourceNameAction {
    return {
        type: actionTypes.UPDATE_HOVERED_RESOURCE_NAME,
        name: name
    };
}