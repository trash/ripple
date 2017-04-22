import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';
import {ICollisionState, IPositionState} from '../components';
import {util} from '../../util';
import {events} from '../../events';
import {constants} from '../../data/constants';
import {mapUtil} from '../util/map';
import {collisionUtil} from '../util/collision';
import {IRowColumnCoordinates} from '../../interfaces';

export class CollisionSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const collisionState = this.manager.getComponentDataForEntity(
                Component.Collision, id) as ICollisionState;
            const positionState = this.manager.getComponentDataForEntity(
                Component.Position, id) as IPositionState;

            // Collision toggled, update tiles and then update map
            if (positionState.tile
                && (positionState.dirty
                    || collisionState.previousActiveState !== collisionState.activeState
                )
            ) {
                // Update tiles collison flags if necessary
                if (collisionState.updatesTile) {
                    this.updateCollisionFlags(
                        id,
                        collisionState,
                        positionState.tile,
                        positionState.previousTile
                    );
                }

                collisionState.previousActiveState = collisionState.activeState;

                if (!collisionState.softCollision) {
                    // Update the map
                    mapUtil.updateCollisionGrid();
                }
            }
        });
    }

    updateCollisionFlags (
        id: number,
        collisionState: ICollisionState,
        tile: IRowColumnCoordinates,
        previousTile: IRowColumnCoordinates
    ) {
        // Clear out old collision tiles
        if (collisionState.softCollision && previousTile) {
            collisionUtil.getTilesFromCollisionEntity(id, false, previousTile).forEach(coords => {
                const occupiedTile = mapUtil.getTile(coords.row, coords.column);
                occupiedTile.softCollision--;
            });
        }

        // Update new collision tiles
        collisionUtil.getTilesFromCollisionEntity(id, false, tile).forEach(coords => {
            const occupiedTile = mapUtil.getTile(coords.row, coords.column);
            const active = collisionState.activeState;
            if (collisionState.softCollision) {
                occupiedTile.softCollision++;
            } else {
                occupiedTile.collision = active;
            }
        });
        // Make sure to always make entrances are accessible
        if (collisionState.entrance) {
            const entranceTile = mapUtil.getTile(
                tile.row + collisionState.entrance.y,
                tile.column + collisionState.entrance.x
            );
            entranceTile.collision = false;
        }
    }
}