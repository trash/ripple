import {gameManager} from '../../game/game-manager';
import {ComponentEnum} from '../component-enum';
import {IHealthState} from '../components/health';
import {IHealthBarState} from '../components/health-bar';
import {IAgentState} from '../components/agent';
import {IPositionState} from '../components/position';
import {IRenderableState} from '../components/renderable';

export class BaseUtil {
    _getHealthState (id): IHealthState {
        return gameManager.entityManager.getComponentDataForEntity(
            ComponentEnum.Health, id) as IHealthState;
    }
    _getAgentState (id): IAgentState {
        return gameManager.entityManager.getComponentDataForEntity(
            ComponentEnum.Agent, id) as IAgentState;
    }
    _getPositionState (id): IPositionState {
        return gameManager.entityManager.getComponentDataForEntity(
            ComponentEnum.Position, id) as IPositionState;
    }
    _getRenderableState (id): IRenderableState {
        return gameManager.entityManager.getComponentDataForEntity(
            ComponentEnum.Renderable, id) as IRenderableState;
    }
    _getHealthBarState (id): IHealthBarState {
        return gameManager.entityManager.getComponentDataForEntity(
            ComponentEnum.HealthBar, id) as IHealthBarState;
    }
}