import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {IBehaviorTreeState} from '../components/behavior-tree';
import {IPositionState} from '../components/position';
import {IAgentState} from '../components/agent';
import {IVillagerState} from '../components/villager';
import {IStatusBubbleState} from '../components/status-bubble';
import {gameManager} from '../../game/game-manager';
import {Blackboard} from '../../../b3/core/blackboard';

export interface IBehaviorTreeTickTarget {
    id: number;
    behaviorTree: IBehaviorTreeState;
    position: IPositionState;
    villager: IVillagerState;
    agent: IAgentState;
    statusBubble: IStatusBubbleState;
    turn: number;
}

export class BehaviorTreeSystem extends EntitySystem {
    update (entityIds: number[], turn: number, stopped: boolean) {
        if (stopped) {
            return;
        }

        entityIds.forEach(id => {
            const behaviorTreeState = this.manager.getComponentDataForEntity(
                    ComponentEnum.BehaviorTree, id) as IBehaviorTreeState,
                agentState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Agent, id) as IAgentState,
                villagerState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Villager, id) as IVillagerState,
                statusBubbleState = this.manager.getComponentDataForEntity(
                    ComponentEnum.StatusBubble, id) as IStatusBubbleState,
                positionState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Position, id) as IPositionState;

            // initialize blackboard
            if (!behaviorTreeState.blackboard) {
                behaviorTreeState.blackboard = new Blackboard();
            }
            const agentsNextTurn = agentState.lastTurn + agentState.speed,
                currentTurn = gameManager.getCurrentTurn();
            if (currentTurn >= agentsNextTurn) {
                agentState.lastTurn = currentTurn;
                behaviorTreeState.tree.tick({
                    id: id,
                    behaviorTree: behaviorTreeState,
                    position: positionState,
                    villager: villagerState,
                    agent: agentState,
                    statusBubble: statusBubbleState,
                    turn: turn
                }, behaviorTreeState.blackboard);
            }
        });
    }
}