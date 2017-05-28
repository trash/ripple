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
import {AutoUpdate} from '../higherOrder/AutoUpdate';

interface EntityListState {
    bottomOpen: boolean;
}

interface EntityListProps {
    topContent: (Element | JSX.Element)[];
    bottomContent: (Element | JSX.Element)[];
}

export class EntityList extends React.Component<EntityListProps, EntityListState> {
    constructor(props) {
        super(props);
        this.state = {
            bottomOpen: false
        };
    }

    toggleBottomOpen(): void {
        this.setState({
            bottomOpen: !this.state.bottomOpen
        });
    }

    render() {
        return (
        <div className={`agent-list-container ${this.state.bottomOpen ? '' : 'bottom-closed'}`}>
            <div className="agent-list">
                {...this.props.topContent}
            </div>
            <div className="agent-list-bottom">
                <button onClick={() => this.toggleBottomOpen()}>toggle</button>
                {...this.props.bottomContent}
            </div>
        </div>
        );
    }
}