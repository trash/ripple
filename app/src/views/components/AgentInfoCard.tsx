import * as React from 'react';
import {Tabs, Tab} from 'react-bootstrap';

import {AgentListEntry} from '../../interfaces';
import {agentUtil, inventoryUtil, equipsArmorUtil} from '../../entity/util';

import {Agent} from '../../data/Agent';
import {VillagerJob} from '../../data/VillagerJob';
import {AgentTrait} from '../../data/AgentTrait';

import {
    IVillagerState,
    IAgentState,
    IInventoryState,
    IVisitorState,
    IPositionState,
    IHealthState,
    IEquipsArmorState
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

const renderArmorProperties = (equipsArmorState: IEquipsArmorState, entity: number): DisplayProperty[] => [
    {
        name: 'Armor',
        value: equipsArmorUtil.toString(entity),
        detailedOnly: false
    }
];

interface AgentInfoCardComponentProps {
    selectedAgent: AgentListEntry;
    detailed?: boolean;
}

class AgentInfoCardComponent extends React.Component<AgentInfoCardComponentProps, object> {
    render() {
        const selectedAgent = this.props.selectedAgent;
        const detailed = this.props.detailed || false;
        if (!selectedAgent) {
            return null;
        }
        return (
            <Tabs
                className="agent-info-card"
                id="agent-info-card-tabs"
                defaultActiveKey={1}>
                <Tab eventKey={1} title="Info">
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
                    { selectedAgent.visitor && filterAndRenderProperties(
                        detailed,
                        renderVisitorProperties(selectedAgent.visitor)
                    ) }
                    { selectedAgent.visitor &&
                        <RecruitVisitorSection
                            visitorId={selectedAgent.id}
                            visitor={selectedAgent.visitor}/>
                    }
                </Tab>
                <Tab eventKey={2} title="Equipment">
                    { filterAndRenderProperties(
                        detailed,
                        renderInventoryProperties(selectedAgent.inventory)
                    ) }
                    { selectedAgent.equipsArmor && filterAndRenderProperties(
                        detailed,
                        renderArmorProperties(selectedAgent.equipsArmor, selectedAgent.id)
                    ) }
                </Tab>
                { selectedAgent.villager &&
                <Tab eventKey={3} title="Villager">
                    { filterAndRenderProperties(
                        detailed,
                        renderVillagerProperties(selectedAgent.villager)
                    ) }
                    { VillagerJobSelect({
                        currentJob: selectedAgent.villager.job,
                        onChange: job => store.dispatch(updateVillagerJob(
                            selectedAgent.id,
                            job
                        ))
                    }) }
                </Tab> }
            </Tabs>
        );
    }
}

export const AgentInfoCard = AutoUpdate(AgentInfoCardComponent, 1000);