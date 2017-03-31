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

interface AgentListProps {
    agents: Immutable.List<AgentListEntry>;
    agentListSelected: number;
}

export class AgentList extends React.Component<AgentListProps, void> {
    render() {
        const selectedAgent = this.props.agents.find(agent => agent.id === this.props.agentListSelected);

        return (
        <div className="agent-list-container">
            <div className="agent-list">
                <div className="agent-list-header">
                    <div>Id</div>
                    <div>Image</div>
                    <div>Health</div>
                    <div>Agent Type</div>
                    <div>Gender</div>
                    <div>Speed</div>
                    <div>Strength</div>
                </div>
                {this.props.agents.map(agentEntry => {
                    return (
                        <div className="agent-list-entry"
                            onClick={() => store.dispatch(agentListSelect(agentEntry.id))}
                            key={agentEntry.id}>
                            <div>{agentEntry.id}</div>
                            <div>
                                <img src={agentUtil.getImagePath(agentEntry.agent.enum)}/>
                            </div>
                            <div>{healthUtil.toString(agentEntry.health)}</div>
                            <div>{Agent[agentEntry.agent.enum]}</div>
                            <div>{agentEntry.agent.gender}</div>
                            <div>{agentEntry.agent.speed}</div>
                            <div>{agentEntry.agent.strength}</div>
                        </div>
                    );
                })}
            </div>
            <div className="agent-list-bottom">
                <p>Detailed information on selected agent shown here.</p>
                {AgentInfoCard(selectedAgent, true)}
            </div>
        </div>
        );
    }
}

export const ConnectedAgentList = connect((state: StoreState) => {
    return {
        agents: state.agentsList,
        agentListSelected: state.agentListSelected
    };
})(AgentList);