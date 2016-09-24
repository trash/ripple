import _ = require('lodash');
import {util} from '../../util';
import {gameManager} from '../../game/game-manager';
import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {IBuildingState} from '../components/building';
import {IRenderableState} from '../components/renderable';
import {IPositionState} from '../components/position';
import {IConstructibleState} from '../components/constructible';
import {IHealthState} from '../components/health';

export class BuildingSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const buildingState = this.manager.getComponentDataForEntity(
                ComponentEnum.Building, id) as IBuildingState,
                positionState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Position, id) as IPositionState,
                healthState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Health, id) as IHealthState,
                constructibleState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Constructible, id) as IConstructibleState,
                renderableState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Renderable, id) as IRenderableState;

            if (renderableState.spriteGroup && !constructibleState.completedSpriteName) {
                this.initSprites(positionState, buildingState, constructibleState, renderableState);
            }
            const tile = positionState.tile;
            if (!buildingState.entranceTile && tile) {
                buildingState.entranceTile = gameManager.map.getTile(
                    tile.row + buildingState.entrancePosition.y,
			        tile.column + buildingState.entrancePosition.x);
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