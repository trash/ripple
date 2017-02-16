import {constants} from '../data/constants';
import {util} from '../util';

import {ITestLevel} from './testLevel';
import {gameLevelFactory} from './gameLevelFactory';
import {VillagerJob} from './villagerJob';
import {Building} from './Building';
import {Agent} from './Agent';
import {Item} from './Item';
import {ItemProperty} from './ItemProperty';

import {IPositionState, IBuildingState} from '../entity/components';
import {dataList as buildingsList} from '../entity/assemblageData/buildings';
import {dataList as itemsList} from '../entity/assemblageData/items';

export interface ITestLevelGroup {
    name: string;
    list: ITestLevel[];
}

const defaultBuildingPosition = {
	tile: {
		row: 5,
		column: 5
	}
};

const allItemsList = [];
itemsList.forEach(itemData => {
	allItemsList.push({
		enum: itemData.item.enum,
		count: util.randomInRange(5, 12)
	});
});

let testLevelsData: ITestLevelGroup[]  = [
	{
		name: 'Building Tests',
		list: [
			{
				name: 'Buildings can be built',
				buildings: [{
					enum: Building.Hut,
					data: {
						position: defaultBuildingPosition
					}
				}],
				agents: [{
					enum: Agent.Human,
					villager: {
						job: VillagerJob.Builder
					}
				}],
				items: [{
					enum: Item.Wood,
					count: 21
				}, {
					enum: Item.Berries,
					count: 4
				}]
			},
			{
				name: 'Completed Building Test',
				buildings: [{
					enum: Building.Hut,
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					}
				}]
			},
			{
				name: 'Tavern stocks up items test',
				buildings: [{
					enum: Building.Tavern,
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					},
				}],
				agents: [{
					enum: Agent.Human,
					villager: {}
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
					enum: Agent.Human,
					villager: {},
					data: {
						hunger: {
							value: constants.HUNGER.MAX * 1/2
						}
					}
				}],
				items: [{
					enum: Item.Berries,
					count: 4
				}]
			},
			{
				name: 'Villager sleeps in house',
				agents: [{
					enum: Agent.Human,
					villager: {}
				}],
				buildings: [{
					enum: Building.Hut,
					isCompleted: true
				}],
			},
			{
				name: 'Villager hides in building',
				agents: [{
					enum: Agent.Zombie,
				}, {
					enum: Agent.Human,
					villager: {}
				}],
				buildings: [{
					enum: Building.Hut,
					isCompleted: true
				}],
			},
		]
	},
	{
		name: 'Visitor Tests',
		list: [
			{
				name: 'Visitor buys items for sale',
				agents: [{
					enum: Agent.Human,
					data: {
						visitor: {
							desiredItems: [ItemProperty.Food]
						}
					}
				}],
				buildings: [{
					enum: Building.Tavern,
					storage: [{
						enum: Item.Berries,
						count: 4
					}],
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					}
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
					enum: Agent.Human,
				}]
			},
			{
				name: 'Zombie attacks villager',
				agents: [{
					enum: Agent.Zombie,
				}, {
					enum: Agent.Human,
					villager: {}
				}],
			},

		]
	},
	{
		name: 'Professions Tests',
		list: [
			{
				name: 'Harvest Test',
				agents: [{
					enum: Agent.Human,
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
				name: 'Builder Test',
				agents: [{
					enum: Agent.Human,
					villager: {
						job: VillagerJob.Builder
					}
				}],
				items: buildingsList[0].constructible.requiredResources
			},
			{
				name: 'Carpenter Test',
				agents: [{
					enum: Agent.Human,
					villager: {
						job: VillagerJob.Carpenter
					}
				}],
				items: [{
					enum: Item.Wood,
					count: 20
				}, {
					enum: Item.Berries,
					count: 4
				}],
				itemsClaimed: true,
				buildings: [{
					enum: Building.CarpenterShop,
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					}
				}]
			},
			{
				name: 'Guard Test',
				agents: [{
					enum: Agent.Human,
					villager: {
						job: VillagerJob.Guard
					}
				}],
				items: [{
					enum: Item.Berries,
					count: 4
				}],
				buildings: [{
					enum: Building.Hut,

					isCompleted: true,
					data: {
						position: {
							tile: {
								column: 2,
								row: 2
							}
						}
					}
				},
				{
					enum: Building.Hut,
					isCompleted: true,
					data: {
						position: {
							tile: {
								row: 15,
								column: 15
							}
						}
					}
				}]
			}
		]
	},
	{
		name: 'Items Tests',
		list: [{
			name: 'Spawn All Items Test',
			items: allItemsList
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