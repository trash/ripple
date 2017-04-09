import {EntitySystem, EntityManager} from '../entityManager';
import {Position, IPositionState} from '../components';
import {positionUtil} from '../util/position';
import {Component} from '../ComponentEnum';

export class PositionSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const positionState = this.manager.getComponentDataForEntity(
                Component.Position, id
            ) as IPositionState;

            if (!positionState.previousTile) {
                positionState.previousTile = positionState.tile;
            }
            if (positionState.hasDirection) {
                positionState.direction = this.getDirection(positionState) || 'down';
            }
        });
    }

    getDirection (entityState: IPositionState): string {
        if (!entityState.previousTile) {
            return 'up';
        }
        return positionUtil.directionToTile(entityState.previousTile, entityState.tile);
    }
}