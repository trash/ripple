import {IAgentState} from '../components/agent';
import {IBehaviorTreeState} from '../components';
import {zombie as zombieTree, deer as deerTree} from '../../b3/Trees';
import {behaviorTree as pathInCircle} from '../../b3/Trees/pathInCircle';
import {
    IEntityComponentData,
    IAssemblageDataMap,
    AgentTraits
} from '../../interfaces';
import {ItemProperty} from '../../data/ItemProperty';
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
            tree: pathInCircle,
        },
        health: defaultHealthState
    },
    {
        agent: {
            enum: Agent.Adventurer,
            genderEnabled: true,
            speed: 15,
            strength: 3,
            traits: [
                AgentTraits.Human
            ],
            gender: 'male',
            nameType: 'human'
        },
        inventory: {
            gold: 50
        },
        visitor: {
            desiredItems: [
                ItemProperty.Armor,
                ItemProperty.Weapon,
                ItemProperty.Potion,
                ItemProperty.Food
            ]
        },
        behaviorTree: {
            tree: pathInCircle,
        },
        health: defaultHealthState
    },
    {
        agent: {
            enum: Agent.Visitor,
            genderEnabled: true,
            gender: 'male',
            nameType: 'human',
            traits: [
                AgentTraits.Human
            ],
            strength: 1,
            speed: 15
        },
        visitor: {
            desiredItems: [ItemProperty.Food]
        },
        inventory: {
            gold: 10
        },
        health: defaultHealthState,
        behaviorTree: {
            tree: pathInCircle,
        },
    }
];

export const assemblageData = (() => {
    let assemblageData: IAssemblageDataMap = {};
    dataList.forEach(data => assemblageData[data.agent.enum] = data);
    return assemblageData;
})();