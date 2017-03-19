import {IRowColumnCoordinates} from '../../interfaces';
import {UPDATE_HOVER_TILE} from './types';

export interface UpdateHoverTile {
    type: UPDATE_HOVER_TILE;
    tile: IRowColumnCoordinates;
}

export function updateHoverTile (tile: IRowColumnCoordinates): UpdateHoverTile {
    return {
        type: UPDATE_HOVER_TILE,
        tile: tile
    };
}