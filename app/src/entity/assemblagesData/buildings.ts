import {IAgentState} from '../components/agent';
import {IBehaviorTreeState} from '../components';
import {IEntityComponentData, IAssemblageDataMap} from '../../interfaces';

const hutEntrance = {
    x: 1,
    y: 2
};

const dataList: IEntityComponentData[] = [
    {
        building: {
            name: 'hut',
            entrancePosition: hutEntrance,
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
            entrance: hutEntrance
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
            healthbarSpritesInitialized: null,
            completedSpriteName: null,
            progressSprite: null,
            completedSprite: null,
            floorSprite: null,
            resourceRequirements: null,
            taskCreated: null
        }
    }
];

export const assemblageData = (() => {
    let assemblageData: IAssemblageDataMap = {};
    dataList.forEach(data => assemblageData[data.building.name] = data);
    return assemblageData;
})();