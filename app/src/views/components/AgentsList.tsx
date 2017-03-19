import * as Immutable from 'immutable';
import {connect} from 'react-redux';
import * as React from 'react';
import {store, StoreState} from '../../redux/store';
import {IAgentState} from '../../entity/components';
import {AgentListEntry} from '../../interfaces';

interface AgentListProps {
    agents: Immutable.List<AgentListEntry>
}

export class AgentList extends React.Component<AgentListProps, void> {
    render() {
        return (
        <div className="agent-list-container">
            <div className="agent-list">
                {this.props.agents.map(agentEntry => {
                    return (
                        <div className="agent-list-entry"
                            key={agentEntry.id}
                            >{agentEntry.id}
                        </div>
                    );
                })}
            </div>
            <div className="agent-list-bottom">
                <p>Detailed information on selected agent shown here.</p>
            </div>
        </div>
        );
    }
}

export const ConnectedAgentList = connect((state: StoreState) => {
    return {
        agents: state.agentsList
    };
})(AgentList);