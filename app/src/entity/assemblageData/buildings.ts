import {IAgentState} from '../components/agent';
import {IBehaviorTreeState} from '../components';
import {IEntityComponentData, IAssemblageDataMap} from '../../interfaces';

export const dataList: IEntityComponentData[] = [
    {
        building: {
            name: 'hut',
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
            requiredResources: {
                wood: 20
            },
            floorSpriteName: 'construction-dirt',
		    progressSpriteName: 'hut-construction',
        }
    },
    {
        building: {
            name: 'house',
            maxOccupants: 2
        },
        constructible: {
            requiredResources: {
                plank: 40
            },
            floorSpriteName: 'construction-dirt',
            progressSpriteName: 'house-construction'
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
            name: 'storage',

        },
        constructible: {
            requiredResources: {
                plank: 40,
                stone: 10,
            },
            floorSpriteName: 'construction-dirt-2',
            progressSpriteName: 'storage-construction'
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
            name: 'tavern',
            maxOccupants: 10,
        },
        constructible: {
            requiredResources: {
                plank: 60,
                stone: 20,
            },
            floorSpriteName: 'construction-dirt-2',
            progressSpriteName: 'tavern-construction'
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
        // storage: {
        //     restrictions: [ItemProperties.food],
        //     amount: 20
        // }
    }
];

export const assemblageData = (() => {
    let assemblageData: IAssemblageDataMap = {};
    dataList.forEach(data => assemblageData[data.building.name] = data);
    return assemblageData;
})();