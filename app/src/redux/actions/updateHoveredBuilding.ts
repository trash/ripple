import {MapTile} from '../../map/tile';
import {UPDATE_HOVERED_BUILDING} from './types';
import {BuildingInfo} from '../../interfaces';
import {IBuildingState, IConstructibleState} from '../../entity/components';

export interface UpdateHoveredBuilding {
    type: UPDATE_HOVERED_BUILDING;
    building: IBuildingState;
    constructible: IConstructibleState;
}

export function updateHoveredBuilding (
    building: IBuildingState,
    constructible: IConstructibleState
): UpdateHoveredBuilding {
    return {
        type: UPDATE_HOVERED_BUILDING,
        building: building,
        constructible: constructible
    };
}