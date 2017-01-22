import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

export interface UpdateHoverTile {
    type: string;
    tile: MapTile;
}

export function updateHoverTile (tile: MapTile): UpdateHoverTile {
    return {
        type: actionTypes.UPDATE_HOVER_TILE,
        tile: tile
    };
}