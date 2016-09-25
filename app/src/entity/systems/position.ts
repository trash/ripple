import {EntitySystem, EntityManager} from '../entity-manager';
import {Position, IPositionState} from '../components/position';

export class PositionSystem extends EntitySystem {
    update (entityIds: number[]) {
        const entitiesMap = this.manager.getEntitiesWithComponent(Position.enum);

        entityIds.forEach(id => {
            const entityState = entitiesMap[id] as IPositionState;

            if (!entityState.previousTile) {
                entityState.previousTile = entityState.tile;
            }
            if (entityState.hasDirection) {
                entityState.direction = this.getDirection(entityState) || 'down';
            }
        });
    }

    getDirection (entityState: IPositionState): string {
        if (!entityState.previousTile) {
            return 'up';
        }
        return entityState.previousTile.directionToTile(entityState.tile);
    }
}