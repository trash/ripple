import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';

import {IBehaviorTreeState} from '../components/behavior-tree';
import {IPositionState} from '../components/position';
import {IAgentState} from '../components/agent';
import {IVillagerState} from '../components/villager';
import {IHealthState} from '../components/health';
import {ISleepState} from '../components/sleep';
import {INameState} from '../components/name';
import {IHungerState} from '../components/hunger';
import {IInventoryState} from '../components/inventory';
import {IStatusBubbleState} from '../components/status-bubble';

import {Blackboard} from '../../b3/core/blackboard';
import {events} from '../../events';
import {GameMap} from '../../map';
import {IBehaviorTreeTickTarget} from '../../interfaces';

let map: GameMap;
events.on('map-update', (newMap: GameMap) => {
    map = newMap;
});

export class BehaviorTreeSystem extends EntitySystem {
    update (entityIds: number[], turn: number, stopped: boolean) {
        if (stopped) {
            return;
        }

        entityIds.forEach(id => {
            const behaviorTreeState = this.manager.getComponentDataForEntity(
                    ComponentEnum.BehaviorTree, id) as IBehaviorTreeState;
            const healthState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Health, id) as IHealthState;
            const agentState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Agent, id) as IAgentState;
            const villagerState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Villager, id) as IVillagerState;
            const statusBubbleState = this.manager.getComponentDataForEntity(
                    ComponentEnum.StatusBubble, id) as IStatusBubbleState;
            const positionState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Position, id) as IPositionState;
            const inventoryState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Inventory, id) as IInventoryState;
            const sleepState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Sleep, id) as ISleepState;
            const hungerState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Hunger, id) as IHungerState;
            const nameState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Name, id) as INameState;

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
                    health: healthState,
                    villager: villagerState,
                    agent: agentState,
                    sleep: sleepState,
                    name: nameState,
                    hunger: hungerState,
                    statusBubble: statusBubbleState,
                    turn: turn,
                    map: map,
                    inventory: inventoryState
                }, behaviorTreeState.blackboard);
            }
        });
    }
}