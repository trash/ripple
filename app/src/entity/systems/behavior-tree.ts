import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {IBehaviorTreeState} from '../components/behavior-tree';
import {IPositionState} from '../components/position';
import {IAgentState} from '../components/agent';
import {IVillagerState} from '../components/villager';
import {IInventoryState} from '../components/inventory';
import {IStatusBubbleState} from '../components/status-bubble';
import {Blackboard} from '../../b3/core/blackboard';
import {events} from '../../events';
import {GameMap} from '../../map';

let map: GameMap;
events.on('map-update', (newMap: GameMap) => {
    map = newMap;
});

export interface IBehaviorTreeTickTarget {
    id: number;
    behaviorTree: IBehaviorTreeState;
    position: IPositionState;
    villager: IVillagerState;
    agent: IAgentState;
    statusBubble: IStatusBubbleState;
    turn: number;
    map: GameMap;
    inventory: IInventoryState;
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
                    ComponentEnum.Position, id) as IPositionState,
                inventoryState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Inventory, id) as IInventoryState;

            // initialize blackboard
            if (!behaviorTreeState.blackboard) {
                behaviorTreeState.blackboard = new Blackboard();
            }
            const agentsNextTurn = agentState.lastTurn + agentState.speed,
                currentTurn = turn;
            if (currentTurn >= agentsNextTurn) {
                agentState.lastTurn = currentTurn;
                // console.info(behaviorTreeState.blackboard._getTreeMemory(
                //     behaviorTreeState.tree.id));
                behaviorTreeState.tree.tick({
                    id: id,
                    behaviorTree: behaviorTreeState,
                    position: positionState,
                    villager: villagerState,
                    agent: agentState,
                    statusBubble: statusBubbleState,
                    turn: turn,
                    map: map,
                    inventory: inventoryState
                }, behaviorTreeState.blackboard);
            }
        });
    }
}