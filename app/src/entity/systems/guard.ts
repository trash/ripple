import * as _ from 'lodash';
import {util} from '../../util';
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';
import {
    IBuildingState,
    IVillagerState
} from '../components';
import {buildingUtil} from '../util/building';
import {villagerUtil} from '../util/villager';
import {taskQueueManager} from '../../Tasks/TaskQueueManager';
import {GuardTask} from '../../tasks/GuardTask';
import {Profession} from '../../data/Profession';

export class GuardSystem extends EntitySystem {
	taskMap: Map<number, GuardTask>;

	constructor (manager, component) {
        super(manager, component);
		this.taskMap = new Map();
	}

	cleanTaskMap () {
		// Clean out villagers that became guards
		this.taskMap.forEach((value, key, map) => {
			const guardTarget = value.guardTarget;
            const villager = this.manager.getComponentDataForEntity(
                Component.Villager,
                value.guardTarget
            );
			if (villager &&
				villagerUtil.hasProfession(villager, Profession.Guard)
			) {
				value.complete();
				map.delete(key);
			}
		});
	};

	update () {
		this.cleanTaskMap();

		let guardTargets: number[] = [];

        let buildings = this.manager
            .getEntityIdsForComponent(Component.Building);
        let villagers = this.manager
            .getEntityIdsForComponent(Component.Villager);

        buildings = buildings
            .map(id => {
                return {
                    state: this.manager.getComponentDataForEntity(
                        Component.Building, id) as IBuildingState,
                    id: id
                };
            })
			// Don't guard walls
			.filter(building => building.state.name !== 'wall')
            .map(building => building.id);
        villagers = villagers
            .map(id => {
                return {
                    state: this.manager.getComponentDataForEntity(
                        Component.Villager, id) as IVillagerState,
                    id: id
                };
            })
            // Guards shouldn't guard themselves
            .filter(villager => !villagerUtil.hasProfession(
                villager.state, Profession.Guard))
            .map(villager => villager.id);

		// Loop through every building and villager and make sure each one has an active guard task
		guardTargets
            .concat(buildings)
            .concat(villagers)
			.forEach(target => {
				if (!this.taskMap.has(target)) {
					const guardTaskManager = taskQueueManager
                        .professionTaskQueue(Profession.Guard);
					const task = guardTaskManager.push(target) as GuardTask;
					this.taskMap.set(target, task);
				}
				if (this.taskMap.get(target).isComplete()) {
					this.taskMap.delete(target);
				}
			});
	};
};