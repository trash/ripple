import _ = require('lodash');
import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {ICollisionState} from '../components/collision';
import {IPositionState} from '../components/position';
import {util} from '../../util';
import {events} from '../../events';
import {constants} from '../../data/constants';
import {mapUtil} from '../util/map';

export class CollisionSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const collisionState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Collision, id) as ICollisionState,
                positionState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Position, id) as IPositionState;

            // Collision toggled, update tiles and then update map
            if (collisionState.previousActiveState !== collisionState.activeState) {
                const tile = positionState.tile;
                for (var x=tile.column; x < tile.column + collisionState.size.x; x++) {
                    for (var y=tile.row; y < tile.row + collisionState.size.y; y++) {
                        const occupiedTile = mapUtil.getTile(y, x);
                        occupiedTile.accessible = !collisionState.activeState;
                    }
                }
                // Make sure to always make entrances are accessible
                if (collisionState.entrance) {
                    const entranceTile = mapUtil.getTile(
                        tile.row + collisionState.entrance.y,
                        tile.column + collisionState.entrance.x);
                    entranceTile.accessible = true;
                }
                collisionState.previousActiveState = collisionState.activeState;
            }
        });
    }
}