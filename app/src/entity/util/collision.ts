import {Component} from '../ComponentEnum';
import {IPositionState} from '../components/position';
import {ICollisionState} from '../components/collision';
import {events} from '../../events';
import {BaseUtil} from './base';
import {positionUtil} from './position';
import {IRowColumnCoordinates} from '../../interfaces';

export class CollisionUtil extends BaseUtil {
    getAllCollisionEntities(): number[] {
        return this.entityManager.getEntityIdsForComponent(Component.Collision);
    }

    /**
     * Returns all tiles that the entity has marked as collidable.
     * This is determined by the dimensions of the collision component for that
     * entity.
     * @param id
     * @param excludeEntranceTile
     */
    getTilesFromCollisionEntity(
        id: number,
        excludeEntranceTile: boolean = false,
        tile: IRowColumnCoordinates = positionUtil.getTileFromEntityId(id, true)
    ): IRowColumnCoordinates[] {
        // Ignore collision entities without a position
        if (!tile) {
            return [];
        }
        const collisionState = this._getCollisionState(id);
        const tiles: IRowColumnCoordinates[] = [];
        for (let x = tile.column; x < tile.column + collisionState.size.x; x++) {
            for (let y = tile.row; y < tile.row + collisionState.size.y; y++) {
                if (excludeEntranceTile &&
                    y === tile.row + collisionState.entrance.y &&
                    x === tile.column + collisionState.entrance.x) {
                    continue;
                }
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