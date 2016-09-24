import {gameLevelFactory} from './game-level-factory';
import {IPositionState} from '../entity/components/position';
import {IBuildingState} from '../entity/components/building';
import {villagerJobs} from './villager-jobs';
import {ITestLevel} from './test-level';

interface ITestLevelGroup {
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
					name: 'hut'
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
					name: 'hut'
				}]
			}
		]
	},
	{
		name: 'Agent Spawning Tests',
		list: [
			{
				name: 'Zombie attacks villager',
				agents: [{
					name: 'zombie'
				}, {
					name: 'human',
					villager: {}
				}]
			},
			{
				name: 'Spawn Wolf And Zombie',
				agents: [{
					name: 'wolf'
				}, {
					name: 'zombie'
				}, {
					name: 'human'
				}]
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