import {constants} from '../data/constants';
import {util} from '../util';

import {ITestLevel} from './testLevel';
import {gameLevelFactory} from './gameLevelFactory';
import {VillagerJob} from './villagerJob';

import {IPositionState, IBuildingState} from '../entity/components';
import {dataList as buildingsList} from '../entity/assemblageData/buildings';
import {dataList as itemsList} from '../entity/assemblageData/items';

export interface ITestLevelGroup {
    name: string;
    list: ITestLevel[];
}

const allItemsMap = {};
itemsList.forEach(itemData => {
	allItemsMap[itemData.item.name] = util.randomInRange(5, 12)
});

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
						job: VillagerJob.Builder
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
		name: 'Villager Tests',
		list: [
			{
				name: 'Villager eats food when hungry',
				agents: [{
					name: 'human',
					villager: {},
					data: {
						hunger: {
							value: constants.HUNGER.MAX * 1/2
						}
					}
				}],
				items: {
					berries: 2
				}
			},
			{
				name: 'Villager sleeps in house',
				agents: [{
					name: 'human',
					villager: {}
				}],
				buildings: [{
					buildingName: 'hut',
					isCompleted: true
				}],
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
			},
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
			},

		]
	},
	{
		name: 'Professions Tests',
		list: [
			{
				name: 'Villagers Harvest',
				agents: [{
					name: 'human',
					villager: {
						job: VillagerJob.Laborer
					}
				}],
				gameMap: {
					noResources: false,
					dimension: 20,
					allLand: true,
					seed: 666
				}
			},
			{
				name: 'Villagers Build',
				agents: [{
					name: 'human',
					villager: {
						job: VillagerJob.Builder
					}
				}],
				items: buildingsList[0].constructible.requiredResources
			}
		]
	},
	{
		name: 'Items Tests',
		list: [{
			name: 'Spawn All Items Test',
			items: allItemsMap
		}]
	}
];

export let testLevelsList = testLevelsData.map(group => {
	group.list = group.list.map(levelData => gameLevelFactory.getTestLevel(levelData));
	return group;
});

export const lastLoadedLevelGroup: ITestLevelGroup = {
	name: 'Last Loaded',
	list: [JSON.parse(localStorage.getItem(constants.LAST_LOADED_LEVEL))]
};