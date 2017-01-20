import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {VillagerJobs} from '../../data/villager-jobs';
import {Task} from '../../tasks/task';
import {Instance} from '../../tasks/instance';

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
    enum: ComponentEnum.Villager,
    state: {
        job: VillagerJobs.Unemployed,
        currentTask: null,
        home: null
    }
};