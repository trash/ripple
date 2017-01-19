import {ComponentEnum} from '../component-enum';

import {IHealthState} from '../components/health';
import {ICollisionState} from '../components/collision';
import {IHealthBarState} from '../components/health-bar';
import {IAgentState} from '../components/agent';
import {IItemState} from '../components/item';
import {IPositionState} from '../components/position';
import {IConstructibleState} from '../components/constructible';
import {IBuildingState} from '../components/building';
import {IRenderableState} from '../components/renderable';
import {IVillagerState} from '../components/villager';
import {ISleepState} from '../components/sleep';
import {IHungerState} from '../components/hunger';

import {EntityManager} from '../entity-manager';
import {MapTile} from '../../map/tile';

export class BaseUtil {
    entityManager: EntityManager;

    intialize (entityManager: EntityManager) {
        this.entityManager = entityManager;
    }

    _getHealthState (id: number): IHealthState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Health, id) as IHealthState;
    }
    _getAgentState (id: number): IAgentState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Agent, id) as IAgentState;
    }
    _getItemState (id: number): IItemState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Item, id) as IItemState;
    }
    _getPositionState (id: number): IPositionState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Position, id) as IPositionState;
    }
    _getRenderableState (id: number): IRenderableState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Renderable, id) as IRenderableState;
    }
    _getConstructibleState (id: number): IConstructibleState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Constructible, id) as IConstructibleState;
    }
    _getBuildingState (id: number): IBuildingState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Building, id) as IBuildingState;
    }
    _getHealthBarState (id: number): IHealthBarState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.HealthBar, id) as IHealthBarState;
    }
    _getCollisionState (id: number): ICollisionState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Collision, id) as ICollisionState;
    }
    _getVillagerState (id: number): IVillagerState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Villager, id) as IVillagerState;
    }
    _getSleepState (id: number): ISleepState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Sleep, id) as ISleepState;
    }
    _getHungerState (id: number): IHungerState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Hunger, id) as IHungerState;
    }

    tileContainsEntityOfComponent (componentName: ComponentEnum, tile: MapTile): boolean {
        return Object.keys(this.entityManager.getEntitiesWithComponent(componentName))
            .map(entityId => parseInt(entityId))
            .filter(entityId => {
                const positionState = this.entityManager.getComponentDataForEntity(
                    ComponentEnum.Position, entityId) as IPositionState;
                return positionState.tile && tile.isEqualToCoords(positionState.tile);
            }).length !== 0;
    }
}

export const baseUtil = new BaseUtil();