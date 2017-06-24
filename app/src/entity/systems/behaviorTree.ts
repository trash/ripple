import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';

import {
    IBehaviorTreeState,
    IPositionState,
    IAgentState,
    IVillagerState,
    IHealthState,
    ISleepState,
    INameState,
    IHungerState,
    IInventoryState,
    IStatusBubbleState,
    IVisitorState,
    IEquipsArmorState
} from '../components';

import {Blackboard} from '../../b3/Core';
import {events} from '../../events';
import {GameMap} from '../../map';
import {IBehaviorTreeTickTarget} from '../../interfaces';

let map: GameMap;
events.on('map-update', (newMap: GameMap) => {
    map = newMap;
});

export class BehaviorTreeSystem extends EntitySystem {
    update (entityIds, turn, stopped, clock) {
        if (stopped) {
            return;
        }

        entityIds.forEach(id => {
            const behaviorTreeState = this.manager.getComponentDataForEntity(
                Component.BehaviorTree, id) as IBehaviorTreeState;
            const healthState = this.manager.getComponentDataForEntity(
                Component.Health, id) as IHealthState;
            const agentState = this.manager.getComponentDataForEntity(
                Component.Agent, id) as IAgentState;
            const villagerState = this.manager.getComponentDataForEntity(
                Component.Villager, id) as IVillagerState;
            const statusBubbleState = this.manager.getComponentDataForEntity(
                Component.StatusBubble, id) as IStatusBubbleState;
            const positionState = this.manager.getComponentDataForEntity(
                Component.Position, id) as IPositionState;
            const inventoryState = this.manager.getComponentDataForEntity(
                Component.Inventory, id) as IInventoryState;
            const sleepState = this.manager.getComponentDataForEntity(
                Component.Sleep, id) as ISleepState;
            const hungerState = this.manager.getComponentDataForEntity(
                Component.Hunger, id) as IHungerState;
            const nameState = this.manager.getComponentDataForEntity(
                Component.Name, id) as INameState;
            const visitorState = this.manager.getComponentDataForEntity(
                Component.Visitor, id) as IVisitorState;
            const equipsArmorState = this.manager.getComponentDataForEntity(
                Component.EquipsArmor, id
            ) as IEquipsArmorState;

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
                    clock: clock,
                    inventory: inventoryState,
                    entitySpawner: this.manager.spawner,
                    visitor: visitorState,
                    equipsArmor: equipsArmorState
                }, behaviorTreeState.blackboard);
            }
        });
    }
}