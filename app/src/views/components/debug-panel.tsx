import React = require('react');
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';

import {MapTile} from '../../map/tile';
import {ChildStatus} from '../../b3/core/composite';

interface DebugPanelProps {
    tile: MapTile;
    agent: string;
    resource: string;
    item: string;
    executionChain: ChildStatus[];
}

export class DebugPanel extends React.Component<DebugPanelProps, void> {
    render () {
        const executionChain = this.props.executionChain;
        const lastAction = executionChain && executionChain.length ?
            executionChain[executionChain.length - 1].child.constructor.name :
            null;

        return (
        <div className="debug-ui">
            <h4>Tile: {this.props.tile && this.props.tile.toString()}</h4>
            <h4>Agent: {this.props.agent}</h4>
            <h4>Last Action: {lastAction}</h4>
            <h4>Item: {this.props.item}</h4>
            <h4>Resource: {this.props.resource}</h4>
        </div>
        );
    }
}

export const ConnectedDebugPanel = connect((state: StoreState) => {
    return {
        tile: state.tile,
        agent: state.hoveredAgentName,
        item: state.hoveredItemName,
        resource: state.hoveredResourceName,
        executionChain: state.hoveredAgentLastExecutionChain
    };
})(DebugPanel);