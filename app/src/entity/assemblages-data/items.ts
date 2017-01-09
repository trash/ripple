import {IResourceState} from '../components/resource';
import {IEntityComponentData, IAssemblageDataMap, ItemProperties} from '../../interfaces';
import {util} from '../../util';
import {config} from '../../data/config';

const dataList: IEntityComponentData[] = [{
        item: {
            name: 'wood',
            readableName: 'wood',
            description: 'A pile of wood.',
            spriteName: 'wood',
            value: 1,
            properties: [ItemProperties.resource, ItemProperties.wood],
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
            spriteName: 'berries',
            description: 'Some delicious red berries probably found on the ground.',
            properties: [ItemProperties.food, ItemProperties.farmable],
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
            spriteName: 'purple-mushroom',
            description: 'Purple mushrooms that can be used in alchemists recipes.',
            properties: []
        }
    },
    {
        item: {
            value: 4,
            name: 'stone',
            readableName: 'stone',
            spriteName: 'stone',
            description: 'A pile of stone.',
            properties: [ItemProperties.resource]
        }
    }
];

export const assemblageData = (() => {
    let assemblageData: IAssemblageDataMap = {};
    dataList.forEach(data => assemblageData[data.item.name] = data);
    return assemblageData;
})();