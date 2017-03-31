import * as React from 'react';
import {AgentListEntry} from '../../interfaces';
import {agentUtil, healthUtil} from '../../entity/util';
import {MapUtil} from '../../map/map-util';

import {Agent} from '../../data/Agent';
import {VillagerJob} from '../../data/VillagerJob';
import {AgentTrait} from '../../data/AgentTrait';

import {
    IVillagerState,
    IAgentState,
    IVisitorState,
    IPositionState,
    IHealthState
} from '../../entity/components';

type DisplayProperty = {
    name: string;
    value: string | number;
    detailedOnly: boolean;
}

const renderHealthProperties = (healthState: IHealthState): DisplayProperty[] => [
    {
        name: 'Health',
        value: healthUtil.toString(healthState),
        detailedOnly: false
    }
];

const renderAgentProperties = (agentState: IAgentState): DisplayProperty[] => [
    {
        name: 'Agent Type',
        value: Agent[agentState.enum],
        detailedOnly: false
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

const renderPositionProperties = (positionState: IPositionState): DisplayProperty[] => [
    {
        name: 'Tile',
        value: MapUtil.tileToString(positionState.tile),
        detailedOnly: false
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

const filterAndRenderProperties = (
    detailed: boolean, properties: DisplayProperty[]
): JSX.Element[] => {
    return properties
        .filter(displayProperty => detailed || !displayProperty.detailedOnly)
        .map(displayProperty => <div key={displayProperty.name}>{displayProperty.name}: {displayProperty.value}</div>);
};

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
                <img src={agentUtil.getImagePath(selectedAgent.agent.enum)}/>
            </div>
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
        </div>
    );
}