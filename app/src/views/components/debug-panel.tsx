import React = require('react');
import {connect} from 'react-redux';
import {store} from '../../redux/store';
import {MapTile} from '../../map/tile';

interface DebugPanelProps {
    tile: MapTile;
}

export class DebugPanel extends React.Component<DebugPanelProps, any> {
    render () {
        return (
        <div>
            <h1>Debug</h1>
            <h4>{this.props.tile && this.props.tile.toString()}</h4>
        </div>
        );
    }
}

export const ConnectedDebugPanel = connect(state => {
    return {
        tile: state.tile
    };
})(DebugPanel);