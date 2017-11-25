import * as _ from 'lodash';
import {constants} from '../data/constants';
import {Util} from '../util';

import {ITestLevel} from './TestLevel';
import {gameLevelFactory} from './gameLevelFactory';
import {VillagerJob} from './VillagerJob';
import {Building} from './Building';
import {Agent} from './Agent';
import {Item} from './Item';
import {ItemProperty} from './ItemProperty';

import {IPositionState, IBuildingState} from '../entity/components';
import {dataList as buildingsList} from '../entity/assemblageData/buildings';
import {assemblageData as agentsData} from '../entity/assemblageData/agents';
import {dataList as itemsList} from '../entity/assemblageData/items';
import {behaviorTree as pathInCircle} from '../b3/Trees/pathInCircle';

export interface ITestLevelGroup {
    name: string;
    list: ITestLevel[];
}

const defaultBuildingPosition = {
	tile: {
		row: 5,
		column: 9
	}
};
const defaultBuildingPosition2 = {
	tile: {
		row: 10,
		column: 9
	}
}

const lowerRightPosition = {
	tile: {
		row: 15,
		column: 15
	}
};

const visitorRecruitCostPlusOne = _.cloneDeep(agentsData[Agent.Visitor].visitor.recruitCost);
Array.from(visitorRecruitCostPlusOne).forEach(entry => {
	entry.count++;
});

const allItemsList = [];
itemsList.forEach(itemData => {
	allItemsList.push({
		enum: itemData.item.enum,
		count: Util.randomInRange(5, 12)
	});
});

let testLevelsData: ITestLevelGroup[]  = [
	{
		name: 'Map Tests',
		list: [{
			name: 'Seed is deterministic',
			gameMap: {
				seed: 666,
				dimension: 40
			}
		}]
	},
	{
		name: 'Building Tests',
		list: [
			{
				name: 'Item Shop auto-stock test',
				buildings: [{
					enum: Building.ItemShop,
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					},
				}],
				items: [{
					enum: Item.Berries,
					count: 24
				}],
				agents: [{
					enum: Agent.Villager,
				}]
			},
			{
				name: '2x Building Concurrency test',
				buildings: [{
					enum: Building.Hut,
					data: {
						position: defaultBuildingPosition
					}
				}, {
					enum: Building.Hut,
					data: {
						position: defaultBuildingPosition2
					}
				}],
				agents: [{
					enum: Agent.Villager,
					data: {
						villager: {
							job: VillagerJob.Builder
						}
					}
				}, {
					enum: Agent.Villager,
					data: {
						villager: {
							job: VillagerJob.Builder
						}
					}
				}],
				items: [{
					enum: Item.Wood,
					count: 39
				}, {
					enum: Item.Berries,
					count: 4
				}]
			},
			{
				name: 'Agents cant enter buildings at max occupancy',
				buildings: [{
					enum: Building.Hut,
					data: {
						position: defaultBuildingPosition,
					},
					isCompleted: true
				}],
				agents: [{
					enum: Agent.Villager,
				}, {
					enum: Agent.Villager,
				}, {
					enum: Agent.Villager,
				}, {
					enum: Agent.Zombie,
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
				name: 'Buildings can be built',
				buildings: [{
					enum: Building.Hut,
					data: {
						position: defaultBuildingPosition
					}
				}],
				agents: [{
					enum: Agent.Villager,
					data: {
							villager: {
							job: VillagerJob.Builder
						}
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
						position: defaultBuildingPosition,
					},
					shop: [{
						enum: Item.Berries,
						count: 4
					}]
				}],
				agents: [{
					enum: Agent.Villager,
				}]
			},
			{
				name: 'Select Item Shop stock test',
				buildings: [{
					enum: Building.ItemShop,
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					},
					shop: [{
						enum: Item.Berries,
						count: 2
					}]
				}],
				items: [{
					enum: Item.Berries,
					count: 4
				}],
				agents: [{
					enum: Agent.Villager,
				}]
			}
		]
	},
	{
		name: 'Villager Tests',
		list: [
			{
				name: 'Villagers equip best armor available',
				agents: [{
					enum: Agent.Villager,
					armor: Item.ArmorWood
				}],
				items: [{
					enum: Item.Berries,
					count: 4
				}, {
					enum: Item.ArmorCopper,
					count: 1,
					data: {
						position: lowerRightPosition
					}
				}],
			},
			{
				name: 'Villagers select different houses to live in',
				agents: [{
					enum: Agent.Villager
				}, {
					enum: Agent.Villager
				}, {
					enum: Agent.Villager
				}],
				buildings: [{
					enum: Building.Hut,
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					}
				}, {
					enum: Building.Hut,
					isCompleted: true,
					data: {
						position: defaultBuildingPosition2
					}
				}],
			},
			{
				name: 'Villager eats food when hungry',
				agents: [{
					enum: Agent.Villager,
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
					enum: Agent.Villager
				}],
				buildings: [{
					enum: Building.Hut,
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					}
				}],
			},
			{
				name: 'Villager hides in building',
				agents: [{
					enum: Agent.Zombie,
				}, {
					enum: Agent.Villager
				}],
				buildings: [{
					enum: Building.Hut,
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					}
				}],
			},
		]
	},
	{
		name: 'Visitor Tests',
		list: [
			{
				name: 'Can recruit visitor',
				agents: [{
					enum: Agent.Visitor
				}],
				buildings: [{
					enum: Building.Tavern,
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					}
				}],
				items: visitorRecruitCostPlusOne,
			},
			{
				name: 'Adventurer buys items',
				agents: [{
					enum: Agent.Adventurer
				}],
				buildings: [{
					enum: Building.BlacksmithShop,
					shop: [{
						enum: Item.SwordWood,
						count: 4
					}],
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					}
				}]
			},
			{
				name: 'Adventurer hunts monsters',
				agents: [{
					enum: Agent.Adventurer,
					data: {
						position: defaultBuildingPosition
					}
				}, {
					enum: Agent.Zombie
				}],
			},
			{
				name: 'Visitor buys items for sale',
				agents: [{
					enum: Agent.Visitor
				}],
				buildings: [{
					enum: Building.Tavern,
					shop: [{
						enum: Item.Berries,
						count: 4
					}],
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					}
				}]
			},
			{
				name: 'Visitor leaves town sad if no items to buy',
				agents: [{
					enum: Agent.Visitor
				}]
			},
			{
				name: 'Visitor flees if attacked',
				agents: [{
					enum: Agent.Visitor,
					data: {
						position: {
							tile: {
								row: 10,
								column: 10
							}
						}
					}
				}],
			}
		]
	},
	{
		name: 'Agent Spawning Tests',
		list: [
			{
				name: 'Bunch of different agents test',
				agents:	new Array(10).fill({
					enum: Agent.Zombie
				}).concat(new Array(10).fill({
					enum: Agent.Adventurer
				})).concat(new Array(10).fill({
					enum: Agent.Villager
				}))
			},
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
					enum: Agent.Villager
				}],
			},
			{
				name: 'Villager corpse test',
				agents: [{
					enum: Agent.Zombie
				}, {
					enum: Agent.Villager,
					data: {
						health: {
							currentHealth: 10,
							maxHealth: 20
						},
					}
				},
				{
					enum: Agent.Villager,
					data: {
						health: {
							currentHealth: 10,
							maxHealth: 20
						},
					}
				},
				{
					enum: Agent.Villager,
					data: {
						health: {
							currentHealth: 10,
							maxHealth: 20
						}
					}
				}]
			}
		]
	},
	{
		name: 'Professions Tests',
		list: [
			{
				name: 'Villager changes jobs',
				agents: [{
					enum: Agent.Villager,
					data: {
						villager: {
							job: VillagerJob.Unemployed
						}
					}
				}],
				items: buildingsList[0].constructible.requiredResources
			},
			{
				name: 'Harvest Test',
				agents: [{
					enum: Agent.Villager,
					data: {
						villager: {
							job: VillagerJob.Laborer
						}
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
					enum: Agent.Villager,
					data: {
						villager: {
							job: VillagerJob.Builder
						}
					}
				}],
				items: buildingsList[0].constructible.requiredResources
			},
			{
				name: 'Carpenter Test',
				agents: [{
					enum: Agent.Villager,
					data: {
						villager: {
							job: VillagerJob.Carpenter
						}
					}
				}],
				items: [{
					enum: Item.Wood,
					count: 20
				}, {
					enum: Item.Berries,
					count: 4
				}],
				buildings: [{
					enum: Building.CarpenterShop,
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					}
				}]
			},
			{
				name: 'Blacksmith Test',
				agents: [{
					enum: Agent.Villager,
					data: {
						villager: {
							job: VillagerJob.Blacksmith
						}
					}
				}],
				items: [{
					enum: Item.Wood,
					count: 20
				}, {
					enum: Item.Berries,
					count: 4
				}],
				buildings: [{
					enum: Building.BlacksmithShop,
					isCompleted: true,
					data: {
						position: defaultBuildingPosition
					}
				}]
			},
			{
				name: 'Guard Test',
				agents: [{
					enum: Agent.Villager,
					data: {
						villager: {
							job: VillagerJob.Guard
						}
					}
				}],
				items: [{
					enum: Item.Berries,
					count: 4
				}, {
					enum: Item.ArmorWood,
					count: 1
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
		list: [
			{
				name: 'Spawn All Items Test',
				items: allItemsList
			},
			{
				name: 'Claimed vs Unclaimed test',
				items: [{
					enum: Item.Berries,
					count: 4
				}, {
					enum: Item.Berries,
					count: 2,
					claimed: false
				}]
			}
		]
	},
	{
		name: 'Rendering Tests',
		list: [
			{
				name: 'Agents disappear when they enter buildings',
				buildings: [{
					enum: Building.Hut,
					data: {
						position: defaultBuildingPosition,
					},
					isCompleted: true
				}],
				agents: [{
					enum: Agent.Villager,
				}, {
					enum: Agent.Villager,
				}, {
					enum: Agent.Zombie,
				}],
				items: [{
					enum: Item.Berries,
					count: 4
				}]
			},
			{
				name: 'z-index test',
				agents: [{
					enum: Agent.Human,
					data: {
						position: {
							tile: {
								row: 19,
								column: 19
							}
						}
					}
				}],
				gameMap: {
					dimension: 40,
					noResources: false,
					allLand: true
				}
			},
			{
				name: 'Subcontainer change doesnt cause jumping sprites',
				agents: [{
					enum: Agent.Human,
					data: {
						position: {
							tile: {
								row: 19,
								column: 19
							}
						}
					}
				}],
				gameMap: {
					dimension: 40,
					noResources: true,
					allLand: true
				}
			}
		]
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