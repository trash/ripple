import * as Immutable from 'immutable';
import {connect} from 'react-redux';
import * as React from 'react';
import {store, StoreState} from '../../redux/store';
import {agentListSelect} from '../../redux/actions';
import {IAgentState} from '../../entity/components';
import {AgentListEntry} from '../../interfaces';
import {Agent} from '../../data/Agent';
import {agentUtil, healthUtil} from '../../entity/util';
import {AgentInfoCard} from './AgentInfoCard';
import {EntityList} from './EntityList';
import {AutoUpdate} from '../higherOrder/AutoUpdate';

interface AgentListProps {
    agents: Immutable.List<AgentListEntry>;
    agentListSelected: number;
}

export class AgentListComponent extends React.Component<AgentListProps, object> {
    entityList: EntityList;

    selectEntity(agent: AgentListEntry): void {
        this.entityList.toggleBottomOpen(true);
        store.dispatch(agentListSelect(agent.id, agent.position));
    }

    render() {
        const selectedAgent = this.props.agents.find(agent => agent.id === this.props.agentListSelected);

        return (
            <EntityList
                ref={el => this.entityList = el}
                topContent={[
                    <div key="nah" className="entity-list-header">
                        <div className="id-column">Id</div>
                        <div className="sprite-column"></div>
                        <div className="health-column">Health</div>
                        <div className="type-column">Agent Type</div>
                    </div>,
                    ...this.props.agents.map(agentEntry => {
                        return (
                            <div
                                className="entity-list-entry"
                                onClick={() => this.selectEntity(agentEntry)}
                                key={agentEntry.id}
                            >
                                <div className="id-column">{agentEntry.id}</div>
                                <div className="sprite-column">
                                    <img src={agentUtil.getImagePathFromAgentState(agentEntry.agent)}/>
                                </div>
                                <div className="health-column">{healthUtil.toString(agentEntry.health, 'dead')}</div>
                                <div className="type-column">{Agent[agentEntry.agent.enum]}</div>
                            </div>
                        );
                    }).toArray()
                ]}
                bottomContent={[
                    <AgentInfoCard key="nah" selectedAgent={selectedAgent} detailed={true}/>
                ]}/>
        );
    }
}

const AgentList = AutoUpdate(AgentListComponent, 1000);

export const ConnectedAgentList = connect((state: StoreState) => {
    return {
        agents: state.agentsList,
        agentListSelected: state.agentListSelected
    };
}, function(){return{}} as any)(AgentList);