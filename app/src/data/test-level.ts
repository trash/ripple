import {villagerJobs} from './villager-jobs';

import {IEntityComponentData} from '../interfaces';

import {IPositionState} from '../entity/components/position';
import {IHungerState} from '../entity/components/hunger';

export interface IVillagerComponentOptions {
	job?: villagerJobs
}

export interface IAgentAssemblageTestData {
    name: string;
	villager?: IVillagerComponentOptions;
    data?: IEntityComponentData;
}

export interface IBuildingAssemblageTestData {
	buildingName: string;
    isCompleted?: boolean;
}

export interface ITestGameMapOptions {
    dimension: number;
    seed: number;
    allLand?: boolean;
    noResources?: boolean;
}

export interface ITestItemsMap {
	[key: string]: number;
}

export interface ITestLevel {
    name: string;
    description?: string;
    agents?: IAgentAssemblageTestData[];
	buildings?: IBuildingAssemblageTestData[];
    gameMap?: ITestGameMapOptions;
	items?: ITestItemsMap;
}