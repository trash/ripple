import * as _ from 'lodash';;
import {util} from '../../util';
import {EntitySystem, EntityManager} from '../entity-manager';
import {statusBubbleUtil} from '../util/status-bubble';
import {buildingUtil} from '../util/building';

import {ComponentEnum} from '../component-enum';
import {IVillagerState} from '../components/villager';
import {IAgentState} from '../components/agent';
import {IRenderableState} from '../components/renderable';
import {IPositionState} from '../components/position';
import {IBehaviorTreeState} from '../components/behavior-tree';
import {IStatusBubbleState} from '../components/status-bubble';

import {Task} from '../../tasks/task';
import {Instance} from '../../tasks/instance';
import {professionsList, Professions} from '../../data/professions';
import {VillagerJobs, villagerJobsMap} from '../../data/villager-jobs';
import {taskQueueManager} from '../../tasks/task-queue-manager';
import {behaviorTree as villagerTree} from '../../b3/trees/villager';

export class VillagerSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const agentState = this.manager.getComponentDataForEntity(
					ComponentEnum.Agent, id) as IAgentState;
            const behaviorTreeState = this.manager.getComponentDataForEntity(
					ComponentEnum.BehaviorTree, id) as IBehaviorTreeState;
            const positionState = this.manager.getComponentDataForEntity(
					ComponentEnum.Position, id) as IPositionState;
            const statusBubbleState = this.manager.getComponentDataForEntity(
					ComponentEnum.StatusBubble, id) as IStatusBubbleState;
            const villagerState = this.manager.getComponentDataForEntity(
					ComponentEnum.Villager, id) as IVillagerState;

			if (behaviorTreeState.tree.name !== 'villager') {
				behaviorTreeState.tree = villagerTree;
			}

			const newTask = this.getTaskForVillager(id, villagerState);
			const newTaskId = newTask ? newTask.id : null;
			const currentTaskId = villagerState.currentTask ?
				villagerState.currentTask.id :
				null;
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
		task = this.getTaskFromprofessionsList(id, villagerState);
		if (task) {
			return task;
		}
		return null;
    }

    hasProfession (villagerState: IVillagerState, profession: Professions): boolean {
        const job = villagerJobsMap[villagerState.job];
        return job.professions.includes(profession);
    }

    getTaskFromprofessionsList (id: number, villagerState: IVillagerState): Instance {
        let match = null;

		// Count over professionsList in order
		professionsList.some(profession => {
			// Make sure they have the profession
			if (this.hasProfession(villagerState, profession)) {
				var taskQueue = taskQueueManager.professionTaskQueue(profession);
				if (taskQueue.hasTask()) {
					match = taskQueue.getTask(id);
					return true;
				}
			}
		});
		return match;
    }
}