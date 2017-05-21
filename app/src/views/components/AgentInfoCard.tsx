import * as React from 'react';
import {AgentListEntry} from '../../interfaces';
import {agentUtil, inventoryUtil} from '../../entity/util';

import {Agent} from '../../data/Agent';
import {VillagerJob} from '../../data/VillagerJob';
import {AgentTrait} from '../../data/AgentTrait';

import {
    IVillagerState,
    IAgentState,
    IInventoryState,
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

import {AutoUpdate} from '../higherOrder/AutoUpdate';
import {VillagerJobSelect} from './VillagerJobSelect';
import {RecruitVisitorSection} from './RecruitVisitorSection';

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

const renderInventoryProperties = (inventoryState: IInventoryState): DisplayProperty[] => [
    {
        name: 'Gold',
        value: inventoryState.gold,
        detailedOnly: false
    },
    {
        name: 'Inventory',
        value: inventoryUtil.itemListToString(inventoryState),
        detailedOnly: false
    }
];

interface AgentInfoCardComponentProps {
    selectedAgent: AgentListEntry;
    detailed?: boolean;
}

class AgentInfoCardComponent extends React.Component<AgentInfoCardComponentProps, void> {
    render() {
        const selectedAgent = this.props.selectedAgent;
        const detailed = this.props.detailed || false;
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
                { filterAndRenderProperties(
                    detailed,
                    renderInventoryProperties(selectedAgent.inventory)
                ) }
                { selectedAgent.visitor &&
                    <RecruitVisitorSection
                        visitorId={selectedAgent.id}
                        visitor={selectedAgent.visitor}/>
                }
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
}

export const AgentInfoCard = AutoUpdate(AgentInfoCardComponent, 1000);