import * as _ from 'lodash';
import {util} from '../../util';
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';
import {buildingToNameMap} from '../../data/Building';
import {
    IBuildingState,
    IRenderableState,
    IPositionState,
    IConstructibleState,
    IHealthState,
    INameState,
    ICollisionState,
    IStorageState
} from '../components';
import {mapUtil} from '../util/map';

export class BuildingSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const buildingState = this.manager.getComponentDataForEntity(
                    Component.Building, id) as IBuildingState;
            const positionState = this.manager.getComponentDataForEntity(
                    Component.Position, id) as IPositionState;
            const healthState = this.manager.getComponentDataForEntity(
                    Component.Health, id) as IHealthState;
            const nameState = this.manager.getComponentDataForEntity(
                    Component.Name, id) as INameState;
            const constructibleState = this.manager.getComponentDataForEntity(
                    Component.Constructible, id) as IConstructibleState;
            const renderableState = this.manager.getComponentDataForEntity(
                    Component.Renderable, id) as IRenderableState;
            const collisionState = this.manager.getComponentDataForEntity(
                Component.Collision, id) as ICollisionState;
            const storageState = this.manager.getComponentDataForEntity(
                Component.Storage, id) as IStorageState;

            // Get the name from the enum
            if (!buildingState.name && _.isNumber(buildingState.enum)) {
                buildingState.name = buildingToNameMap.get(buildingState.enum);
            }

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
            if (!storageState.tile) {
                storageState.tile = buildingState.entranceTile;
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