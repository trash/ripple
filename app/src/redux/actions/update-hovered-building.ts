import {MapTile} from '../../map/tile';
import {actionTypes} from './types';
import {BuildingInfo} from '../../interfaces';
import {IBuildingState} from '../../entity/components/building';
import {IConstructibleState} from '../../entity/components/constructible';

export interface UpdateHoveredBuildingAction {
    type: string;
    building: IBuildingState;
    constructible: IConstructibleState;
}

export function updateHoveredBuilding (
    building: IBuildingState,
    constructible: IConstructibleState
): UpdateHoveredBuildingAction {
    return {
        type: actionTypes.UPDATE_HOVERED_BUILDING,
        building: building,
        constructible: constructible
    };
}