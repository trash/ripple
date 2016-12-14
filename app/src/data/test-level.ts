import {IPositionState} from '../entity/components/position';
import {villagerJobs} from './villager-jobs';

export interface IVillagerComponentOptions {
	job?: villagerJobs
}

export interface IAgentAssemblageTestData {
    name: string;
    position?: IPositionState;
	villager?: IVillagerComponentOptions;
}

export interface IBuildingAssemblageTestData {
	buildingName: string;
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