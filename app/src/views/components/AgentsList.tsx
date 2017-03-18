import {connect} from 'react-redux';
import * as React from 'react';
import {store, StoreState} from '../../redux/store';

interface AgentListProps {

}

export class AgentList extends React.Component<AgentListProps, void> {
    render() {
        return (
        <div className="agent-list">
        </div>
        );
    }
}

export const ConnectedAgentList = connect((state: StoreState) => {
    return {};
})(AgentList);