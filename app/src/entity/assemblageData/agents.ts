import {IAgentState} from '../components/agent';
import {IBehaviorTreeState} from '../components';
import {zombie as zombieTree, deer as deerTree} from '../../b3/Trees';
import {
    IEntityComponentData,
    IAssemblageDataMap,
    AgentTraits
} from '../../interfaces';
import {Agent} from '../../data/Agent';

const maxHealth = 100;
const defaultHealthState = {
    currentHealth: maxHealth,
    maxHealth: maxHealth
};

const dataList: IEntityComponentData[] = [
    {
        agent: {
            enum: Agent.Zombie,
            genderEnabled: false,
            speed: 30,
            traits: [
                AgentTraits.Monster
            ],
            strength: 10
        },
        behaviorTree: {
            tree: zombieTree
        },
        health: defaultHealthState
    },
    {
        agent: {
            enum: Agent.Wolf,
            genderEnabled: false,
            speed: 10,
            traits: [
                AgentTraits.Predator
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
            enum: Agent.Human,
            genderEnabled: true,
            spriteCount: 4,
            speed: 15,
            strength: 3,
            traits: [
                AgentTraits.Human
            ]
        },
        behaviorTree: {
            tree: deerTree,
        },
        health: defaultHealthState
    }
];

export const assemblageData = (() => {
    let assemblageData: IAssemblageDataMap = {};
    dataList.forEach(data => assemblageData[data.agent.enum] = data);
    return assemblageData;
})();