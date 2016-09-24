import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {villagerJobsEnum} from '../../data/villager-jobs';
import {Task} from '../../tasks/task';
import {Instance} from '../../tasks/instance';

export interface IVillagerState {
    job: villagerJobsEnum;
    currentTask: Instance;
}

export interface IVillagerComponent extends IComponent {
    state: IVillagerState;
}

export let Villager: IVillagerComponent = {
    name: 'villager',
    enum: ComponentEnum.Villager,
    state: {
        job: villagerJobsEnum.unemployed,
        currentTask: null
    }
};