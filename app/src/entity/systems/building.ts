import * as _ from 'lodash';;
import {util} from '../../util';
import {EntitySystem, EntityManager} from '../entityManager';
import {ComponentEnum} from '../componentEnum';
import {
    IBuildingState,
    IRenderableState,
    IPositionState,
    IConstructibleState,
    IHealthState,
    INameState,
    ICollisionState
} from '../components';
import {mapUtil} from '../util/map';

export class BuildingSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const buildingState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Building, id) as IBuildingState;
            const positionState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Position, id) as IPositionState;
            const healthState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Health, id) as IHealthState;
            const nameState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Name, id) as INameState;
            const constructibleState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Constructible, id) as IConstructibleState;
            const renderableState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Renderable, id) as IRenderableState;
            const collisionState = this.manager.getComponentDataForEntity(
                ComponentEnum.Collision, id) as ICollisionState;

            if (renderableState.spriteGroup
                && !constructibleState.completedSpriteName
            ) {
                this.initSprites(positionState, buildingState,
                    constructibleState, renderableState);
            }
            const tile = positionState.tile;
            if (!buildingState.entranceTile && tile) {
                buildingState.entranceTile = mapUtil.getTile(
                    tile.row + collisionState.entrance.y,
			        tile.column + collisionState.entrance.x);
            }
            if (!nameState.name) {
                if (nameState.isStatic) {
                    nameState.name = buildingState.name;
                }
            }
        });
    }

    initSprites (
        positionState: IPositionState,
        buildingState: IBuildingState,
        constructibleState: IConstructibleState,
        renderableState: IRenderableState
    ) {
        // The sprite group for the agent
        const spriteGroup = renderableState.spriteGroup;

        constructibleState.completedSpriteName = buildingState.name;
    }
}