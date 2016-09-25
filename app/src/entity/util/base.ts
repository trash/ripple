import {ComponentEnum} from '../component-enum';
import {IHealthState} from '../components/health';
import {IHealthBarState} from '../components/health-bar';
import {IAgentState} from '../components/agent';
import {IItemState} from '../components/item';
import {IPositionState} from '../components/position';
import {IConstructibleState} from '../components/constructible';
import {IBuildingState} from '../components/building';
import {IRenderableState} from '../components/renderable';
import {EntityManager} from '../entity-manager';

export class BaseUtil {
    entityManager: EntityManager;

    intialize (entityManager: EntityManager) {
        this.entityManager = entityManager;
    }

    _getHealthState (id): IHealthState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Health, id) as IHealthState;
    }
    _getAgentState (id): IAgentState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Agent, id) as IAgentState;
    }
    _getItemState (id): IItemState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Item, id) as IItemState;
    }
    _getPositionState (id): IPositionState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Position, id) as IPositionState;
    }
    _getRenderableState (id): IRenderableState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Renderable, id) as IRenderableState;
    }
    _getConstructibleState (id): IConstructibleState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Constructible, id) as IConstructibleState;
    }
    _getBuildingState (id): IBuildingState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.Building, id) as IBuildingState;
    }
    _getHealthBarState (id): IHealthBarState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.HealthBar, id) as IHealthBarState;
    }
}

export const baseUtil = new BaseUtil();