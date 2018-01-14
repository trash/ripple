import * as Immutable from 'immutable';
import {connect} from 'react-redux';
import * as React from 'react';

import {store, StoreState} from '../../redux/store';
import {agentListSelect} from '../../redux/actions';

import {AgentListEntry} from '../../interfaces';

import {IAgentState} from '../../entity/components';
import {agentUtil, healthUtil} from '../../entity/util';

import {Agent} from '../../data/Agent';
import {VillagerJob} from '../../data/VillagerJob';

import {AutoUpdate} from '../higherOrder/AutoUpdate';

import {AgentInfoCard} from './AgentInfoCard';
import {EntityList} from './EntityList';

interface VillagerListProps {
    agents: Immutable.List<AgentListEntry>;
    agentListSelected: number;
}

export class VillagerListComponent extends React.Component<VillagerListProps, object> {
    entityList: EntityList;

    selectEntity(agent: AgentListEntry): void {
        this.entityList.toggleBottomOpen(true);
        store.dispatch(agentListSelect(agent.id, agent.position));
    }

    render() {
        const villagers = this.props.agents.filter(entry => !!entry.villager);

        const selectedAgent = villagers
            .find(agent => agent.id === this.props.agentListSelected);

        return (
        <EntityList
            ref={el => this.entityList = el}
            topContent={[
                <div key="noh" className="entity-list-header">
                    <div className="name-column">Name</div>
                    <div className="sprite-column"></div>
                    <div className="health-column">Health</div>
                    <div className="gender-column">Gender</div>
                    <div className="job-column">Job</div>
                </div>,
                ...villagers.map(agentEntry => {
                    return (
                        <div className="entity-list-entry"
                            onClick={() => this.selectEntity(agentEntry)}
                            key={agentEntry.id}>
                            <div className="name-column">{agentEntry.name.name}</div>
                            <div className="sprite-column">
                                <img src={agentUtil.getImagePathFromAgentState(agentEntry.agent)}/>
                            </div>
                            <div className="health-column">{healthUtil.toString(agentEntry.health, 'dead')}</div>
                            <div className="gender-column">{agentEntry.agent.gender}</div>
                            <div className="job-column">{VillagerJob[agentEntry.villager.job]}</div>
                        </div>
                    );
                }).toArray()
            ]}
            bottomContent={[
                <AgentInfoCard key="no" selectedAgent={selectedAgent} detailed={true}/>
            ]}
        />
        );
    }
}

const VillagerList = AutoUpdate(VillagerListComponent, 1000);

export const ConnectedVillagerList = connect((state: StoreState) => {
    return {
        agents: state.agentsList,
        agentListSelected: state.agentListSelected
    };
}, function(){return{}} as any)(VillagerList);