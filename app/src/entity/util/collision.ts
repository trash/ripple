import {ComponentEnum} from '../component-enum';
import {IPositionState} from '../components/position';
import {ICollisionState} from '../components/collision';
import {events} from '../../events';
import {BaseUtil} from './base';
import {IRowColumnCoordinates} from '../../interfaces';

export class CollisionUtil extends BaseUtil {
    getTilesFromCollisionEntity(
        id: number
    ): IRowColumnCoordinates[] {
        const positionState = this._getPositionState(id);
        const tile = positionState.tile;
        const collisionState = this._getCollisionState(id);
        const tiles: IRowColumnCoordinates[] = [];
        for (let x = tile.column; x < tile.column + collisionState.size.x; x++) {
            for (let y = tile.row; y < tile.row + collisionState.size.y; y++) {
                tiles.push({
                    row: y,
                    column: x
                });
            }
        }
        return tiles;
    }
}

export const collisionUtil = new CollisionUtil();