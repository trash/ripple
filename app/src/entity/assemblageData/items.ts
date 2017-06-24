import {IResourceState} from '../components/resource';
import {IEntityComponentData, IAssemblageDataMap} from '../../interfaces';
import {util} from '../../util';
import {config} from '../../data/config';
import {Profession} from '../../data/Profession';
import {Item} from '../../data/Item';
import {ItemProperty} from '../../data/ItemProperty';

const itemCollisionState = {
    size: {
        x: 1,
        y: 1
    },
    softCollision: true
};

export const dataList: IEntityComponentData[] = [{
        item: {
            enum: Item.Wood,
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
        collision: itemCollisionState
    },
    {
        item: {
            enum: Item.Berries,
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
        collision: itemCollisionState
    },
    {
        item: {
            enum: Item.Mushroom,
            value: 1,
            name: 'mushroom',
            readableName: 'mushroom',
            description: 'Purple mushrooms that can be used in alchemists recipes.',
            properties: []
        },
        collision: itemCollisionState
    },
    {
        item: {
            enum: Item.Stone,
            value: 4,
            name: 'stone',
            readableName: 'stone',
            description: 'A pile of stone.',
            properties: [ItemProperty.Resource]
        },
        collision: itemCollisionState
    },
    {
        item: {
            enum: Item.Plank,
            name: 'plank',
            readableName: 'Plank',
            description: 'A plank for crafting things made of wood.'
        },
        craftable: {
            requiredResources: [{
                enum: Item.Wood,
                count: 4
            }],
            craftTurns: 2,
            profession: Profession.Carpenter
        },
        collision: itemCollisionState
    },
    {
        item: {
            enum: Item.SwordWood,
            value: 10,
            name: 'sword-wood',
            readableName: 'Wooden Sword',
            description: 'A very basic sword made out of wood. Might hurt a bit if you get hit with it.',
            properties: [
                ItemProperty.Wood,
                ItemProperty.Sword,
                ItemProperty.Weapon
            ],
        },
        // damage: 1,
        craftable: {
            requiredResources: [{
                enum: Item.Wood,
                count: 10
            }],
            profession: Profession.Blacksmith,
            craftTurns: 20,
        },
        collision: itemCollisionState
	},
    {
        item: {
            enum: Item.ArmorWood,
            value: 20,
            name: 'armor-wood',
            readableName: 'Wooden Armor',
            description: `Simple armor made of pieces of wood strung together with leather. Don't let it get wet.`,
            properties: [
                ItemProperty.Wood,
                ItemProperty.Armor,
            ],
        },
        // damage: 1,
        craftable: {
            requiredResources: [{
                enum: Item.Wood,
                count: 10
            }],
            profession: Profession.Blacksmith,
            craftTurns: 20,
        },
        collision: itemCollisionState
	},
];

export const assemblageData = (() => {
    let assemblageData: IAssemblageDataMap = {};
    dataList.forEach(data => assemblageData[data.item.enum] = data);
    return assemblageData;
})();