import {gameLevelFactory} from './game-level-factory';
import {IPositionState} from '../entity/components/position';
import {IBuildingState} from '../entity/components/building';
import {villagerJobs} from './villager-jobs';
import {ITestLevel} from './test-level';
import {constants} from '../data/constants';

export interface ITestLevelGroup {
    name: string;
    list: ITestLevel[];
}

 let testLevelsData: ITestLevelGroup[]  = [
	{
		name: 'Building Tests',
		list: [
			{
				name: 'Buildings can be built',
				buildings: [{
					buildingName: 'hut'
				}],
				agents: [{
					name: 'human',
					villager: {
						job: villagerJobs.builder
					}
				}],
				items: {
					wood: 21,
					berries: 4
				}
			},
			{
				name: 'Completed Building Test',
				buildings: [{
					buildingName: 'hut'
				}]
			}
		]
	},
	{
		name: 'Agent Spawning Tests',
		list: [
			{
				name: 'Agent paths around map',
				agents: [{
					name: 'human'
				}]
			},
			{
				name: 'Zombie attacks villager',
				agents: [{
					name: 'zombie'
				}, {
					name: 'human',
					villager: {}
				}],
				gameMap: {
					noResources: true,
					dimension: 20,
					seed: 666,
					allLand: true
				}
			},
			{
				name: 'Villager hides in building',
				agents: [{
					name: 'zombie'
				}, {
					name: 'human',
					villager: {}
				}],
				buildings: [{
					buildingName: 'hut',
					isCompleted: true
				}],
				gameMap: {
					noResources: true,
					dimension: 20,
					seed: 666,
					allLand: true
				}
			},
		]
	},
	{
		name: 'Professions Tests',
		list: [
			{
				name: 'Villagers Can Harvest',
				agents: [{
					name: 'human',
					villager: {
						job: villagerJobs.laborer
					}
				}]
			}
		]
	}
];

export let testLevels = testLevelsData.map(group => {
	group.list = group.list.map(levelData => gameLevelFactory.getTestLevel(levelData));
	return group;
});

export const lastLoadedLevelGroup: ITestLevelGroup = {
	name: 'Last Loaded',
	list: [JSON.parse(localStorage.getItem(constants.LAST_LOADED_LEVEL))]
};