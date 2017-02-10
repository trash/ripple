import * as _ from 'lodash';
import {util} from '../../util';
import {EntitySystem, EntityManager} from '../entityManager';
import {statusBubbleUtil} from '../util';
import {buildingUtil} from '../util/building';
import {villagerUtil} from '../util/villager';

import {Component} from '../ComponentEnum';
import {
	IVillagerState,
	IAgentState,
	IRenderableState,
	IPositionState,
	IBehaviorTreeState,
	IStatusBubbleState,
} from '../components';

import {Task} from '../../Tasks/Task';
import {Instance} from '../../Tasks/Instance';
import {professionsList, Profession} from '../../data/Profession';
import {VillagerJob, villagerJobsMap} from '../../data/villagerJob';
import {taskQueueManager} from '../../Tasks/TaskQueueManager';
import {villager as villagerTree} from '../../b3/Trees';

export class VillagerSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const agentState = this.manager.getComponentDataForEntity(
					Component.Agent, id) as IAgentState;
            const behaviorTreeState = this.manager.getComponentDataForEntity(
					Component.BehaviorTree, id) as IBehaviorTreeState;
            const positionState = this.manager.getComponentDataForEntity(
					Component.Position, id) as IPositionState;
            const statusBubbleState = this.manager.getComponentDataForEntity(
					Component.StatusBubble, id) as IStatusBubbleState;
            const villagerState = this.manager.getComponentDataForEntity(
					Component.Villager, id) as IVillagerState;

			if (behaviorTreeState.tree.name !== 'villager') {
				behaviorTreeState.tree = villagerTree;
			}

			const newTask = this.getTaskForVillager(id, villagerState);
			const newTaskId = newTask ? newTask.id : null;
			const currentTaskId = villagerState.currentTask
				? villagerState.currentTask.id
				: null;
			if (currentTaskId !== newTaskId) {
				// Clear bubble for task ending
				if (!newTaskId) {
					this.clearBubbleForTask(villagerState.currentTask, id);
				// Activate bubble for task starting
				} else {
					this.activateBubbleForTask(newTask, id);
				}
			}
			villagerState.currentTask = newTask;

			if (!villagerState.home) {
				const freeHome = buildingUtil.getFreeHome();
				if (freeHome) {
					villagerState.home = freeHome;
				}
			}
        });
    }

	clearBubbleForTask (taskInstance: Instance, id: number) {
		const bubbleName = taskInstance.task.bubble;
		statusBubbleUtil.removeStatusBubble(id, bubbleName);
	}
	activateBubbleForTask (taskInstance: Instance, id: number) {
		const bubbleName = taskInstance.task.bubble;
		statusBubbleUtil.addStatusBubble(id, bubbleName);
	}

    getTaskForVillager (id: number, villagerState: IVillagerState): Instance {
        var task = villagerState.currentTask;
		// Continue on current task unless it's no longer ready then bail on it
		if (task && task.isReady() && !task.isComplete()) {
			return task;
		}
		task = this.getTaskFromProfessionList(id, villagerState);
		if (task) {
			return task;
		}
		return null;
    }

	private getProfessions(villagerState: IVillagerState): Profession[] {
		return professionsList.filter(profession =>
			villagerUtil.hasProfession(villagerState, profession));
	}

    getTaskFromProfessionList (
		id: number,
		villagerState: IVillagerState
	): Instance {
        let match = null;

		this.getProfessions(villagerState).some(profession => {
			const taskQueue = taskQueueManager.professionTaskQueue(profession);
			if (taskQueue.hasTask()) {
				match = taskQueue.getTask(id);
				return true;
			}
		});
		return match;
    }
}