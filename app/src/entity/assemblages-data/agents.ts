import {IAgentState} from '../components/agent';
import {IBehaviorTreeState} from '../components/behavior-tree';
import {behaviorTree as deerTree} from '../../b3/trees/deer';
// import {zombieTree} from '../../b3/trees/zombie';
// import {wolfTree} from '../../b3/trees/wolf';
import {IEntityComponentData, IAssemblageDataMap, AgentTraits} from '../../interfaces';

const maxHealth = 100,
    defaultHealthState = {
        currentHealth: maxHealth,
        maxHealth: maxHealth
    };

const dataList: IEntityComponentData[] = [{
        agent: {
            agentName: 'zombie',
            genderEnabled: false,
            speed: 30,
            traits: [
                AgentTraits.monster
            ],
            strength: 10
        },
        behaviorTree: {
            // tree: zombieTree,
            tree: deerTree
        },
        health: defaultHealthState
    },
    {
        agent: {
            agentName: 'wolf',
            genderEnabled: false,
            speed: 10,
            traits: [
                AgentTraits.predator
            ],
            strength: 5
        },
        behaviorTree: {
            // tree: wolfTree,
            tree: deerTree
        },
        health: defaultHealthState
    },
    {
        agent: {
            agentName: 'human',
            genderEnabled: true,
            spriteCount: 4,
            speed: 15,
            strength: 3,
            traits: [
                AgentTraits.human
            ]
        },
        behaviorTree: {
            tree: deerTree,
        },
        health: defaultHealthState
}];

export const agentsAssemblageData: IAssemblageDataMap = {
    zombie: dataList[0],
    wolf: dataList[1],
    human: dataList[2]
};