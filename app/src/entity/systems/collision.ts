import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entityManager';
import {Components} from '../ComponentsEnum';
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
                Components.Collision, id) as ICollisionState;
            const positionState = this.manager.getComponentDataForEntity(
                Components.Position, id) as IPositionState;

            // Collision toggled, update tiles and then update map
            if (collisionState.previousActiveState !== collisionState.activeState
                && positionState.tile
            ) {
                // Update tiles collison flags if necessary
                if (collisionState.updatesTile) {
                    this.updateCollisionFlags(id, collisionState,
                        positionState.tile);
                }

                collisionState.previousActiveState = collisionState.activeState;

                // Update the map
                mapUtil.updateCollisionGrid();
            }
        });
    }

    updateCollisionFlags (
        id: number,
        collisionState: ICollisionState,
        tile: IRowColumnCoordinates
    ) {
        collisionUtil.getTilesFromCollisionEntity(id).forEach(coords => {
            const occupiedTile = mapUtil.getTile(coords.row, coords.column);
            occupiedTile.collision = collisionState.activeState;
        });
        // Make sure to always make entrances are accessible
        if (collisionState.entrance) {
            const entranceTile = mapUtil.getTile(
                tile.row + collisionState.entrance.y,
                tile.column + collisionState.entrance.x);
            entranceTile.collision = false;
        }
    }
}