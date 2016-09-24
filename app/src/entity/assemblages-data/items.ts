import {IResourceState} from '../components/resource';
import {IEntityComponentData, IAssemblageDataMap, ItemProperties} from '../../interfaces';
import {util} from '../../util';
import {config} from '../../config';

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
            hasBeenSpawned: null
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
            hasBeenSpawned: null
        },
    }
];

export const itemsAssemblageData: IAssemblageDataMap = {
    wood: dataList[0],
    berries: dataList[1]
};