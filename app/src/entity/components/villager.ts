import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {VillagerJob} from '../../data/villagerJob';
import {Task} from '../../Tasks/task';
import {Instance} from '../../Tasks/instance';

export interface IVillagerState {
    job: VillagerJob;
    currentTask: Instance;
    home: number;
}

export interface IVillagerComponent extends IComponent {
    state: IVillagerState;
}

const blacklistedDebugProperties = ['currentTask'];

export let Villager: IVillagerComponent = {
    name: 'villager',
    enum: Component.Villager,
    blacklistedDebugProperties: blacklistedDebugProperties,
    state: {
        job: VillagerJob.Unemployed,
        currentTask: null,
        home: null
    }
};