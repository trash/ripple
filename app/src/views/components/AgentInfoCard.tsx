import * as React from 'react';
import {AgentListEntry} from '../../interfaces';
import {agentUtil} from '../../entity/util';

import {Agent} from '../../data/Agent';
import {VillagerJob, villagerJobsMap} from '../../data/VillagerJob';
import {AgentTrait} from '../../data/AgentTrait';

import {
    IVillagerState,
    IAgentState,
    IVisitorState,
    IPositionState,
    IHealthState
} from '../../entity/components';

import {
    DisplayProperty,
    filterAndRenderProperties,
    renderHealthProperties,
    renderPositionProperties
} from './InfoCard';

import {store} from '../../redux/store';
import {updateVillagerJob} from '../../redux/actions';

const renderAgentProperties = (agentState: IAgentState): DisplayProperty[] => [
    {
        name: 'Agent Type',
        value: Agent[agentState.enum],
        detailedOnly: true
    },
    {
        name: 'Alive',
        value: !agentState.dead + '',
        detailedOnly: false
    },
    {
        name: 'Gender',
        value: agentState.gender,
        detailedOnly: true
    },
    {
        name: 'Speed',
        value: agentState.speed,
        detailedOnly: true
    },
    {
        name: 'Strength',
        value: agentState.strength,
        detailedOnly: true
    },
    {
        name: 'Traits',
        value: agentState.traits.map(trait => AgentTrait[trait]).toString(),
        detailedOnly: true
    },
];

const renderVillagerProperties = (villagerState: IVillagerState): DisplayProperty[] => [
    {
        name: 'Job',
        value: VillagerJob[villagerState.job],
        detailedOnly: true
    },
    {
        name: 'Current Task',
        value: villagerState.currentTask && villagerState.currentTask.toString(),
        detailedOnly: false
    },
    {
        name: 'Home',
        value: villagerState.home,
        detailedOnly: true
    },
];

const renderVisitorProperties = (visitorState: IVisitorState): DisplayProperty[] => [
    {
        name: 'Leaving Town',
        value: visitorState.leaveTown + '',
        detailedOnly: false
    }
];

export interface VillagerJobSelectProps {
    currentJob: VillagerJob;
    onChange: Function;
}

export const VillagerJobSelect = (props: VillagerJobSelectProps) =>
    <div>
        Job
        <select value={props.currentJob}
            onChange={e => props.onChange(e.target.value)}>
            {Object.keys(villagerJobsMap).map(jobKey => {
                const job = villagerJobsMap[parseInt(jobKey)];
                return (
                    <option key={job.enum} value={job.enum}>
                        {job.readableName}
                    </option>
                );
            })}
        </select>
    </div>

export const AgentInfoCard = (
    selectedAgent: AgentListEntry,
    detailed: boolean = false
) => {
    if (!selectedAgent) {
        return null;
    }
    return (
        <div className="agent-info-card">
            <div>Id: {selectedAgent.id}</div>
            <div>
                <img src={agentUtil.getImagePathFromAgentState(selectedAgent.agent)}/>
            </div>
            <div>Last Action: {selectedAgent.lastAction}</div>
            { filterAndRenderProperties(
                detailed,
                renderHealthProperties(selectedAgent.health)
            ) }
            { filterAndRenderProperties(
                detailed,
                renderAgentProperties(selectedAgent.agent)
            ) }
            { filterAndRenderProperties(
                detailed,
                renderPositionProperties(selectedAgent.position)
            ) }
            { selectedAgent.villager && filterAndRenderProperties(
                detailed,
                renderVillagerProperties(selectedAgent.villager)
            ) }
            { selectedAgent.visitor && filterAndRenderProperties(
                detailed,
                renderVisitorProperties(selectedAgent.visitor)
            ) }
            { selectedAgent.villager &&
                VillagerJobSelect({
                    currentJob: selectedAgent.villager.job,
                    onChange: job => store.dispatch(updateVillagerJob(
                        selectedAgent.id,
                        job
                    ))
                })
            }
        </div>
    );
}