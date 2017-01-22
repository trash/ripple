import {IAgentState} from '../components/agent';
import {IBehaviorTreeState} from '../components';
import {zombie as zombieTree, deer as deerTree} from '../../b3/Trees';
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
            tree: zombieTree
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

export const assemblageData = (() => {
    let assemblageData: IAssemblageDataMap = {};
    dataList.forEach(data => assemblageData[data.agent.agentName] = data);
    return assemblageData;
})();