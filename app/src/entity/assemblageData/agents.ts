import {IAgentState} from '../components/agent';
import {IBehaviorTreeState} from '../components';
import {
    zombie as zombieTree,
    deer as deerTree,
    visitor as visitorTree,
    villager as villagerTree,
    adventurer as adventurerTree
} from '../../b3/Trees';
import {behaviorTree as pathInCircle} from '../../b3/Trees/pathInCircle';
import {
    IEntityComponentData,
    IAssemblageDataMap
} from '../../interfaces';
import {ItemProperty} from '../../data/ItemProperty';
import {AgentTrait} from '../../data/AgentTrait';
import {Agent} from '../../data/Agent';
import {VillagerJob} from '../../data/VillagerJob';
import {constants} from '../../data/constants';
import {config} from '../../data/config';

const maxHealth = 100;
const defaultHealthState = {
    currentHealth: maxHealth,
    maxHealth: maxHealth
};
const agentCollisionState = {
    size: {
        x: 1,
        y: 1
    },
    softCollision: true
};

const dataList: IEntityComponentData[] = [
    {
        agent: {
            enum: Agent.Zombie,
            genderEnabled: false,
            speed: constants.BASE_SPEED * 2,
            traits: [
                AgentTrait.Monster
            ],
            strength: 10
        },
        behaviorTree: {
            tree: zombieTree
        },
        collision: agentCollisionState,
        health: defaultHealthState
    },
    {
        agent: {
            enum: Agent.Wolf,
            genderEnabled: false,
            speed: constants.BASE_SPEED * 0.8,
            traits: [
                AgentTrait.Predator
            ],
            strength: 5
        },
        behaviorTree: {
            // tree: wolfTree,
            tree: deerTree
        },
        collision: agentCollisionState,
        health: defaultHealthState
    },
    {
        agent: {
            enum: Agent.Human,
            genderEnabled: true,
            spriteCount: 4,
            speed: constants.BASE_SPEED,
            strength: 3,
            traits: [
                AgentTrait.Human
            ]
        },
        collision: agentCollisionState,
        behaviorTree: {
            tree: pathInCircle,
        },
        health: defaultHealthState
    },
    {
        agent: {
            enum: Agent.Adventurer,
            genderEnabled: true,
            speed: constants.BASE_SPEED,
            strength: 3,
            traits: [
                AgentTrait.Human
            ],
            gender: 'male',
            nameType: 'human'
        },
        inventory: {
            gold: 50
        },
        collision: agentCollisionState,
        visitor: {
            desiredItems: [
                ItemProperty.Armor,
                ItemProperty.Weapon,
                ItemProperty.Potion,
                ItemProperty.Food
            ]
        },
        behaviorTree: {
            tree: adventurerTree,
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
                AgentTrait.Human
            ],
            strength: 1,
            speed: constants.BASE_SPEED
        },
        collision: agentCollisionState,
        visitor: {
            desiredItems: [ItemProperty.Food]
        },
        inventory: {
            gold: 10
        },
        health: defaultHealthState,
        behaviorTree: {
            tree: visitorTree,
        },
    },
    {
        agent: {
            enum: Agent.Villager,
            genderEnabled: true,
            spriteType: 'human',
            spriteCount: 4,
            nameType: 'human',
            traits: [
                AgentTrait.Human
            ],
            strength: 3,
            speed: config.averageSpeed.citizen
        },
        collision: agentCollisionState,
        health: defaultHealthState,
        villager: {
            job: VillagerJob.Unemployed,
        },
        behaviorTree: {
            tree: villagerTree
        }
    }
];

export const assemblageData = (() => {
    let assemblageData: IAssemblageDataMap = {};
    dataList.forEach(data => assemblageData[data.agent.enum] = data);
    return assemblageData;
})();