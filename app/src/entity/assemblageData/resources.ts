import {IResourceState} from '../components/resource';
import {IHarvestableState} from '../components/harvestable';
import {IHealthState} from '../components/health';
import {IEntityComponentData, IAssemblageDataMap} from '../../interfaces';
import {util} from '../../util';
import {config} from '../../data/config';
import {HarvestType} from '../../data/harvestType';
import {Profession} from '../../data/Profession';
import {Item} from '../../data/Item';

const treeHealth = util.hoursToTicks(config.gameHoursToCutDownTree)
    / config.averageSpeed.citizen / 10;
const rockHealth = 200;
const bushHealth = 100;
const mushroomHealth = 100;

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
            profession: Profession.Woodcutter,
            highlighted: false,
            queued: false,
            task: null,
            drops: [
                [Item.Wood, '*1']
            ],
            harvestType: HarvestType.Tree
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
            profession: Profession.Miner,
            highlighted: false,
            queued: false,
            task: null,
            drops: [
                [Item.Stone, '*2']
            ],
            harvestType: HarvestType.Rock
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
            profession: Profession.Gatherer,
            highlighted: false,
            queued: false,
            task: null,
            drops: [
                [Item.Berries, '*2']
            ],
            harvestType: HarvestType.Food
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
            profession: Profession.Gatherer,
            highlighted: false,
            queued: false,
            task: null,
            drops: [
                [Item.Mushroom, '*2']
            ],
            harvestType: HarvestType.Mushroom
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