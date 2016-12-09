import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

export interface UpdateHoverTileAction {
    type: string;
    tile: MapTile;
}

export function updateHoverTile (tile: MapTile): UpdateHoverTileAction {
    return {
        type: actionTypes.UPDATE_HOVER_TILE,
        tile: tile
    };
}