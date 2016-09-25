import {IResourceState} from '../components/resource';
import {IHarvestableState, HarvestTypesEnum} from '../components/harvestable';
import {IHealthState} from '../components/health';
import {IEntityComponentData, IAssemblageDataMap} from '../../interfaces';
import {util} from '../../util';
import {config} from '../../data/config';
import {professions} from '../../data/professions';

const treeHealth = util.hoursToTicks(config.gameHoursToCutDownTree) / config.averageSpeed.citizen / 10,
    rockHealth = 200,
    bushHealth = 100,
    mushroomHealth = 100;

const resourcesList: IEntityComponentData[] = [{
        resource: {
            name: 'tree',
            anchor: [0, 0.6],
            spriteKey: {
                'tree1': 5,
                'tree1-1': 1,
                'tree1-2': 1,
                'tree2': 5,
                'tree2-1': 1,
                'tree2-2': 1,
            }
        },
        harvestable: {
            profession: professions.woodcutter,
            highlighted: false,
            queued: false,
            task: null,
            drops: [
                'wood*1'
            ],
            harvestType: HarvestTypesEnum.tree
        },
        health: {
            maxHealth: treeHealth,
            currentHealth: treeHealth
        },
    },
    {
        resource: {
            name: 'rock',
            anchor: [0, 0.6],
            spriteKey: [
				'rock',
				'rock2'
			],
        },
        harvestable: {
            profession: professions.miner,
            highlighted: false,
            queued: false,
            task: null,
            drops: [
                'stone*2'
            ],
            harvestType: HarvestTypesEnum.rock
        },
        health: {
            maxHealth: rockHealth,
            currentHealth: rockHealth
        },
    },
    {
        resource: {
            name: 'bush',
            anchor: [0, 0.6],
            spriteKey: [
                'bush-fruit',
				'bush2-fruit',
				'bush2-2-fruit'
			],
        },
        harvestable: {
            profession: professions.gatherer,
            highlighted: false,
            queued: false,
            task: null,
            drops: [
                'berries*2'
            ],
            harvestType: HarvestTypesEnum.food
        },
        health: {
            maxHealth: bushHealth,
            currentHealth: bushHealth
        },
    },
    {
        resource: {
            name: 'mushroom',
            anchor: [0, 0.1],
            spriteKey: [
                'purple-shroom-1',
				'purple-shroom-2',
				'purple-shroom-3',
				'purple-shroom-4'
			],
        },
        harvestable: {
            profession: professions.gatherer,
            highlighted: false,
            queued: false,
            task: null,
            drops: [
                'mushroom*2'
            ],
            harvestType: HarvestTypesEnum.mushroom
        },
        health: {
            maxHealth: mushroomHealth,
            currentHealth: mushroomHealth
        },
    }
];

export const resourcesAssemblageData: IAssemblageDataMap = {
    tree: resourcesList[0],
    rock: resourcesList[1],
    bush: resourcesList[2],
    mushroom: resourcesList[3]
};