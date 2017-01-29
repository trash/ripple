import {IComponent} from '../entityManager';
import {Components} from '../ComponentsEnum';
import {VillagerJobs} from '../../data/villagerJobs';
import {Task} from '../../Tasks/task';
import {Instance} from '../../Tasks/instance';

export interface IVillagerState {
    job: VillagerJobs;
    currentTask: Instance;
    home: number;
}

export interface IVillagerComponent extends IComponent {
    state: IVillagerState;
}

export let Villager: IVillagerComponent = {
    name: 'villager',
    enum: Components.Villager,
    state: {
        job: VillagerJobs.Unemployed,
        currentTask: null,
        home: null
    }
};