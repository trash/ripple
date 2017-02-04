import {IRowColumnCoordinates} from '../../interfaces';
import {actionTypes} from './types';

export interface UpdateHoverTile {
    type: string;
    tile: IRowColumnCoordinates;
}

export function updateHoverTile (tile: IRowColumnCoordinates): UpdateHoverTile {
    return {
        type: actionTypes.UPDATE_HOVER_TILE,
        tile: tile
    };
}