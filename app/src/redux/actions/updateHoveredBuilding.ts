import {MapTile} from '../../map/tile';
import {UPDATE_HOVERED_BUILDING} from './types';
import {BuildingInfo} from '../../interfaces';
import {IBuildingState, IConstructibleState} from '../../entity/components';

export interface UpdateHoveredBuilding {
    type: UPDATE_HOVERED_BUILDING;
    id: number;
    building: IBuildingState;
    constructible: IConstructibleState;
}

export function updateHoveredBuilding (
    id: number,
    building: IBuildingState,
    constructible: IConstructibleState
): UpdateHoveredBuilding {
    return {
        type: UPDATE_HOVERED_BUILDING,
        id,
        building,
        constructible
    };
}