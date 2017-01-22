import {IResourceState} from '../components/resource';
import {IHarvestableState} from '../components/harvestable';
import {IHealthState} from '../components/health';
import {IEntityComponentData, IAssemblageDataMap} from '../../interfaces';
import {util} from '../../util';
import {config} from '../../data/config';
import {HarvestTypes} from '../../data/harvestTypes';
import {Professions} from '../../data/professions';

const treeHealth = util.hoursToTicks(config.gameHoursToCutDownTree) / config.averageSpeed.citizen / 10,
    rockHealth = 200,
    bushHealth = 100,
    mushroomHealth = 100;

const dataList: IEntityComponentData[] = [{
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
            profession: Professions.Woodcutter,
            highlighted: false,
            queued: false,
            task: null,
            drops: [
                'wood*1'
            ],
            harvestType: HarvestTypes.Tree
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
            profession: Professions.Miner,
            highlighted: false,
            queued: false,
            task: null,
            drops: [
                'stone*2'
            ],
            harvestType: HarvestTypes.Rock
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
            profession: Professions.Gatherer,
            highlighted: false,
            queued: false,
            task: null,
            drops: [
                'berries*2'
            ],
            harvestType: HarvestTypes.Food
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
            profession: Professions.Gatherer,
            highlighted: false,
            queued: false,
            task: null,
            drops: [
                'mushroom*2'
            ],
            harvestType: HarvestTypes.Mushroom
        },
        health: {
            maxHealth: mushroomHealth,
            currentHealth: mushroomHealth
        },
    }
];

export const assemblageData = (() => {
    let assemblageData: IAssemblageDataMap = {};
    dataList.forEach(data => assemblageData[data.resource.name] = data);
    return assemblageData;
})();