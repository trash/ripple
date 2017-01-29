import {Components} from '../ComponentsEnum';

import {
    IHealthState,
    ICollisionState,
    IHealthBarState,
    IAgentState,
    IItemState,
    IPositionState,
    IConstructibleState,
    IBuildingState,
    IRenderableState,
    IVillagerState,
    ISleepState,
    IHungerState,
} from '../components';

import {EntityManager} from '../entityManager';
import {MapTile} from '../../map/tile';

export class BaseUtil {
    entityManager: EntityManager;

    intialize (entityManager: EntityManager) {
        this.entityManager = entityManager;
    }

    _getHealthState (id: number): IHealthState {
        return this.entityManager.getComponentDataForEntity(
            Components.Health, id) as IHealthState;
    }
    _getAgentState (id: number): IAgentState {
        return this.entityManager.getComponentDataForEntity(
            Components.Agent, id) as IAgentState;
    }
    _getItemState (id: number): IItemState {
        return this.entityManager.getComponentDataForEntity(
            Components.Item, id) as IItemState;
    }
    _getPositionState (id: number): IPositionState {
        return this.entityManager.getComponentDataForEntity(
            Components.Position, id) as IPositionState;
    }
    _getRenderableState (id: number): IRenderableState {
        return this.entityManager.getComponentDataForEntity(
            Components.Renderable, id) as IRenderableState;
    }
    _getConstructibleState (id: number): IConstructibleState {
        return this.entityManager.getComponentDataForEntity(
            Components.Constructible, id) as IConstructibleState;
    }
    _getBuildingState (id: number): IBuildingState {
        return this.entityManager.getComponentDataForEntity(
            Components.Building, id) as IBuildingState;
    }
    _getHealthBarState (id: number): IHealthBarState {
        return this.entityManager.getComponentDataForEntity(
            Components.HealthBar, id) as IHealthBarState;
    }
    _getCollisionState (id: number): ICollisionState {
        return this.entityManager.getComponentDataForEntity(
            Components.Collision, id) as ICollisionState;
    }
    _getVillagerState (id: number): IVillagerState {
        return this.entityManager.getComponentDataForEntity(
            Components.Villager, id) as IVillagerState;
    }
    _getSleepState (id: number): ISleepState {
        return this.entityManager.getComponentDataForEntity(
            Components.Sleep, id) as ISleepState;
    }
    _getHungerState (id: number): IHungerState {
        return this.entityManager.getComponentDataForEntity(
            Components.Hunger, id) as IHungerState;
    }

    tileContainsEntityOfComponent (componentName: Components, tile: MapTile): boolean {
        return Object.keys(this.entityManager.getEntitiesWithComponent(componentName))
            .map(entityId => parseInt(entityId))
            .filter(entityId => {
                const positionState = this.entityManager.getComponentDataForEntity(
                    Components.Position, entityId) as IPositionState;
                return positionState.tile && tile.isEqualToCoords(positionState.tile);
            }).length !== 0;
    }
}

export const baseUtil = new BaseUtil();