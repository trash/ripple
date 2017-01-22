import {VillagerJobs} from './villagerJobs';

import {IEntityComponentData} from '../interfaces';

import {IPositionState} from '../entity/components/position';
import {IHungerState} from '../entity/components/hunger';

export interface IVillagerComponentOptions {
	job?: VillagerJobs
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