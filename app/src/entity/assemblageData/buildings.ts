import {IAgentState} from '../components/agent';
import {IBehaviorTreeState} from '../components';
import {IEntityComponentData, IAssemblageDataMap} from '../../interfaces';
import {Building} from '../../data/Building';
import {Item} from '../../data/Item';
import {ItemProperty} from '../../data/ItemProperty';

export const dataList: IEntityComponentData[] = [
    {
        building: {
            enum: Building.Hut,
            maxOccupants: 4
        },
        name: {
            isStatic: true
        },
        collision: {
            size: {
                x: 3,
                y: 3
            },
            entrance: {
                x: 1,
                y: 2
            }
        },
        health: {
            maxHealth: 100,
            // maxHealth: 1000,
            currentHealth: 0
        },
        healthBar: {
            size: 17,
        },
        constructible: {
            requiredResources: [{
                enum: Item.Wood,
                count: 20
            }],
            floorSpriteName: 'construction-dirt'
        }
    },
    {
        building: {
            enum: Building.House,
            maxOccupants: 2
        },
        constructible: {
            requiredResources: [{
                enum: Item.Plank,
                count: 40
            }],
            floorSpriteName: 'construction-dirt'
        },
        collision: {
            size: {
                x: 3,
                y: 2
            },
            entrance: {
                x: 0,
                y: 2
            }
        }
    },
    {
        building: {
            enum: Building.Storage,

        },
        constructible: {
            requiredResources: [{
                enum: Item.Plank,
                count: 40
            }, {
                enum: Item.Stone,
                count: 10
            }],
            floorSpriteName: 'construction-dirt-2'
        },
        collision: {
            size: {
                x: 4,
                y: 5
            },
            entrance: {
                x: 3,
                y: 4
            },
        },
        health: {
            currentHealth: 0,
            maxHealth: 400
        },
        // storage: {
        //     amount: 80,
        //     restrictions: null
        // }
    },
    {
        building: {
            enum: Building.Tavern,
            maxOccupants: 10,
        },
        constructible: {
            requiredResources: [{
                enum: Item.Plank,
                count: 60
            }, {
                enum: Item.Stone,
                count: 20
            }],
            floorSpriteName: 'construction-dirt-2'
        },
        collision: {
            size: {
                x: 4,
                y: 4
            },
            entrance: {
                x: 1,
                y: 4
            },
        },
        health: {
            currentHealth: 0,
            maxHealth: 500
        },
        storage: {
            itemRestrictions: [ItemProperty.Food],
            total: 20,
            available: 20
        }
    },
    {
        building: {
            enum: Building.CarpenterShop,
        },
        constructible: {
            requiredResources: [{
                enum: Item.Wood,
                // count: 40
                count: 10
            }],
            floorSpriteName: 'construction-dirt-2'
        },
        collision: {
            size: {
                x: 4,
                y: 4
            },
            entrance: {
                x: 2,
                y: 4
            },
        },
        health: {
            currentHealth: 0,
            maxHealth: 400
        },
    },
    {
        building: {
            enum: Building.BlacksmithShop,
        },
        constructible: {
            requiredResources: [{
                enum: Item.Plank,
                // count: 40
                count: 10
            }],
            floorSpriteName: 'construction-dirt-2'
        },
        collision: {
            size: {
                x: 4,
                y: 4
            },
            entrance: {
                x: 0,
                y: 3
            },
        },
        health: {
            currentHealth: 0,
            maxHealth: 400
        },
    }
];

export const assemblageData = (() => {
    let assemblageData: IAssemblageDataMap = {};
    dataList.forEach(data => assemblageData[data.building.enum] = data);
    return assemblageData;
})();