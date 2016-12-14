import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

export interface UpdateHoveredBuildingNameAction {
    type: string;
    name: string;
}

export function updateHoveredBuildingName (name: string): UpdateHoveredBuildingNameAction {
    return {
        type: actionTypes.UPDATE_HOVERED_BUILDING_NAME,
        name: name
    };
}