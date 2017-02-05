import {IResourceState} from '../components/resource';
import {IEntityComponentData, IAssemblageDataMap, ItemProperty} from '../../interfaces';
import {util} from '../../util';
import {config} from '../../data/config';
import {Profession} from '../../data/profession';

export const dataList: IEntityComponentData[] = [{
        item: {
            name: 'wood',
            readableName: 'wood',
            description: 'A pile of wood.',
            value: 1,
            properties: [ItemProperty.Resource, ItemProperty.Wood],
            shouldBeSpawned: null,
            claimed: null,
            toBeStored: null,
            hasBeenSpawned: null,
            stored: null
        },
    },
    {
        item: {
            value: 1,
            name: 'berries',
            readableName: 'berries',
            description: 'Some delicious red berries probably found on the ground.',
            properties: [ItemProperty.Food, ItemProperty.Farmable],
            shouldBeSpawned: null,
            claimed: null,
            toBeStored: null,
            hasBeenSpawned: null,
            stored: null
        },
    },
    {
        item: {
            value: 1,
            name: 'mushroom',
            readableName: 'mushroom',
            description: 'Purple mushrooms that can be used in alchemists recipes.',
            properties: []
        }
    },
    {
        item: {
            value: 4,
            name: 'stone',
            readableName: 'stone',
            description: 'A pile of stone.',
            properties: [ItemProperty.Resource]
        }
    },
    {
        item: {
            name: 'plank',
            readableName: 'Plank',
            description: 'A plank for crafting things made of wood.'
        },
        craftable: {
            requiredResources: {
                wood: 4
            },
            craftTurns: 2,
            profession: Profession.Carpenter
        }
    }
];

export const assemblageData = (() => {
    let assemblageData: IAssemblageDataMap = {};
    dataList.forEach(data => assemblageData[data.item.name] = data);
    return assemblageData;
})();