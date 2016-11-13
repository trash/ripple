import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

export function updateHoverTile (tile: MapTile) {
    return {
        type: actionTypes.UPDATE_HOVER_TILE,
        tile: tile
    };
}