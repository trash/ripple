import {Component} from '../ComponentEnum';

import {
    IHealthState,
    ICollisionState,
    IHealthBarState,
    IAgentState,
    IItemState,
    IPositionState,
    IInventoryState,
    IConstructibleState,
    IBuildingState,
    IRenderableState,
    IVillagerState,
    ISleepState,
    IHungerState,
    IStorageState,
    IVisitorState
} from '../components';

import {EntityManager} from '../entityManager';
import {MapTile} from '../../map/tile';

export class BaseUtil {
    entityManager: EntityManager;

    intialize (entityManager: EntityManager) {
        this.entityManager = entityManager;
    }

    destroyEntity(entity: number) {
        this.entityManager.destroyEntity(entity);
    }

    _getHealthState (id: number): IHealthState {
        return this.entityManager.getComponentDataForEntity(
            Component.Health, id) as IHealthState;
    }
    _getAgentState (id: number): IAgentState {
        return this.entityManager.getComponentDataForEntity(
            Component.Agent, id) as IAgentState;
    }
    _getItemState (id: number): IItemState {
        return this.entityManager.getComponentDataForEntity(
            Component.Item, id) as IItemState;
    }
    _getPositionState (id: number): IPositionState {
        return this.entityManager.getComponentDataForEntity(
            Component.Position, id) as IPositionState;
    }
    _getRenderableState (id: number): IRenderableState {
        return this.entityManager.getComponentDataForEntity(
            Component.Renderable, id) as IRenderableState;
    }
    _getConstructibleState (id: number): IConstructibleState {
        return this.entityManager.getComponentDataForEntity(
            Component.Constructible, id) as IConstructibleState;
    }
    _getBuildingState (id: number): IBuildingState {
        return this.entityManager.getComponentDataForEntity(
            Component.Building, id) as IBuildingState;
    }
    _getHealthBarState (id: number): IHealthBarState {
        return this.entityManager.getComponentDataForEntity(
            Component.HealthBar, id) as IHealthBarState;
    }
    _getCollisionState (id: number): ICollisionState {
        return this.entityManager.getComponentDataForEntity(
            Component.Collision, id) as ICollisionState;
    }
    _getVillagerState (id: number): IVillagerState {
        return this.entityManager.getComponentDataForEntity(
            Component.Villager, id) as IVillagerState;
    }
    _getSleepState (id: number): ISleepState {
        return this.entityManager.getComponentDataForEntity(
            Component.Sleep, id) as ISleepState;
    }
    _getHungerState (id: number): IHungerState {
        return this.entityManager.getComponentDataForEntity(
            Component.Hunger, id) as IHungerState;
    }
    _getStorageState (id: number): IStorageState {
        return this.entityManager.getComponentDataForEntity(
            Component.Storage, id) as IStorageState;
    }
    _getVisitorState (id: number): IVisitorState {
        return this.entityManager.getComponentDataForEntity(
            Component.Visitor, id) as IVisitorState;
    }
    _getInventoryState (id: number): IInventoryState {
        return this.entityManager.getComponentDataForEntity(
            Component.Inventory, id) as IInventoryState;
    }

    tileContainsEntityOfComponent (componentName: Component, tile: MapTile): boolean {
        return Object.keys(this.entityManager.getEntitiesWithComponent(componentName))
            .map(entityId => parseInt(entityId))
            .filter(entityId => {
                const positionState = this.entityManager.getComponentDataForEntity(
                    Component.Position, entityId) as IPositionState;
                return positionState.tile && tile.isEqualToCoords(positionState.tile);
            }).length !== 0;
    }
}

export const baseUtil = new BaseUtil();