import * as React from 'react';
import {AgentListEntry} from '../../interfaces';
import {agentUtil} from '../../entity/util';
import {Agent} from '../../data/Agent';
import {
    IVillagerState,
    IAgentState,
    IVisitorState
} from '../../entity/components';

type DisplayProperty = [string, string | number, boolean];

const renderAgentProperties = (agentState: IAgentState): DisplayProperty[] => [
    ['Agent Type', Agent[agentState.enum], true],
    ['Gender', agentState.gender, false],
    ['Speed', agentState.speed, false],
    ['Strength', agentState.strength, false],
];

const renderVillagerProperties = (villagerState: IVillagerState): DisplayProperty[] => [
    ['Job', villagerState.job, false],
    ['Current Task', villagerState.currentTask && villagerState.currentTask.toString(), true],
    ['Home', villagerState.home, false]
];

const renderVisitorProperties = (visitorState: IVisitorState): DisplayProperty[] => [
    ['Leaving Town', visitorState.leaveTown + '', true]
];

const filterBriefProperties = (brief: boolean, pair: DisplayProperty) =>
    !brief || pair[2];

const renderDisplayProperty = (pair: DisplayProperty) => (
    <div key={pair[0]}>{pair[0]}: {pair[1]}</div>
);

const filterAndRenderProperties = (
    brief: boolean, properties: DisplayProperty[]
): JSX.Element[] => {
    return properties
        .filter(filterBriefProperties.bind(null, brief))
        .map(renderDisplayProperty);
};

export const AgentInfoCard = (
    selectedAgent: AgentListEntry,
    brief: boolean = true
) => {
    if (!selectedAgent) {
        return null;
    }
    return (
        <div className="agent-info-card">
            <div>Id: {selectedAgent.id}</div>
            <div>
                <img src={agentUtil.getImagePath(selectedAgent.agent.enum)}/>
            </div>
            { filterAndRenderProperties(
                brief,
                renderAgentProperties(selectedAgent.agent)
            ) }
            { selectedAgent.villager && filterAndRenderProperties(
                brief,
                renderVillagerProperties(selectedAgent.villager)
            ) }
            { selectedAgent.visitor && filterAndRenderProperties(
                brief,
                renderVisitorProperties(selectedAgent.visitor)
            ) }
        </div>
    );
}