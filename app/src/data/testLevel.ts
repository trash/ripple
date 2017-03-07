import {VillagerJob} from './VillagerJob';
import {Building} from './Building';
import {Agent} from './Agent';
import {Item} from './Item';

import {IEntityComponentData, RequiredResources} from '../interfaces';

import {IPositionState} from '../entity/components/position';
import {IHungerState} from '../entity/components/hunger';

export interface IVillagerComponentOptions {
	job?: VillagerJob
}

export interface IAgentAssemblageTestData {
    enum: Agent;
    data?: IEntityComponentData;
}

export interface IItemAssemblageTestData {
    enum: Item;
    data?: IEntityComponentData;
    count?: number;
}

export interface IBuildingAssemblageTestData {
	enum: Building;
    isCompleted?: boolean;
    data?: IEntityComponentData;
    storage?: RequiredResources;
}

export interface ITestGameMapOptions {
    dimension: number;
    seed?: number;
    allLand?: boolean;
    noResources?: boolean;
}

export interface ITestLevel {
    name: string;
    description?: string;
    agents?: IAgentAssemblageTestData[];
	buildings?: IBuildingAssemblageTestData[];
    gameMap?: ITestGameMapOptions;
	items?: IItemAssemblageTestData[];
    itemsClaimed?: boolean;
}