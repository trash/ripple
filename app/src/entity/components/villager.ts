import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {VillagerJob} from '../../data/villagerJob';
import {Task} from '../../Tasks/Task';
import {Instance} from '../../Tasks/Instance';

export interface IVillagerState {
    job: VillagerJob;
    currentTask: Instance;
    home: number;
}

const blacklistedDebugProperties = ['currentTask'];

export const Villager: IComponent<IVillagerState> = {
    name: 'villager',
    enum: Component.Villager,
    blacklistedDebugProperties: blacklistedDebugProperties,
    getInitialState: () => {
        return {
            job: VillagerJob.Unemployed,
            currentTask: null,
            home: null
        };
    }
};