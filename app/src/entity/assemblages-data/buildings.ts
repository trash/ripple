import {IAgentState} from '../components/agent';
import {IBehaviorTreeState} from '../components/behavior-tree';
import {deerTree} from '../../b3/trees/deer';
import {IEntityComponentData, IAssemblageDataMap} from '../../interfaces';

const hutEntrance = {
    x: 1,
    y: 2
};

const dataList: IEntityComponentData[] = [
    {
        building: {
            name: 'hut',
            entrancePosition: hutEntrance
        },
        collision: {
            size: {
                x: 3,
                y: 3
            },
            entrance: hutEntrance
        },
        health: {
            maxHealth: 1000,
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

export const assemblageData: IAssemblageDataMap = {
    hut: dataList[0],
};