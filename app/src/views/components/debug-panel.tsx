import React = require('react');
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {MapTile} from '../../map/tile';

interface DebugPanelProps {
    tile: MapTile;
    agent: string;
    resource: string;
}

export class DebugPanel extends React.Component<DebugPanelProps, void> {
    render () {
        return (
        <div>
            <h4>Tile: {this.props.tile && this.props.tile.toString()}</h4>
            <h4>Agent: {this.props.agent}</h4>
            <h4>Resource: {this.props.resource}</h4>
        </div>
        );
    }
}

export const ConnectedDebugPanel = connect((state: StoreState) => {
    return {
        tile: state.tile,
        agent: state.hoveredAgentName,
        resource: state.hoveredResourceName
    };
})(DebugPanel);