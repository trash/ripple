import {MapTile} from '../../map/tile';
import {actionTypes} from './types';
import {BuildingInfo} from '../../interfaces';
import {IBuildingState, IConstructibleState} from '../../entity/components';

export interface UpdateHoveredBuilding {
    type: string;
    building: IBuildingState;
    constructible: IConstructibleState;
}

export function updateHoveredBuilding (
    building: IBuildingState,
    constructible: IConstructibleState
): UpdateHoveredBuilding {
    return {
        type: actionTypes.UPDATE_HOVERED_BUILDING,
        building: building,
        constructible: constructible
    };
}