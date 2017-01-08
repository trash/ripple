import React = require('react');
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {CollisionDebugView} from './collision-debug-view';

import {IBuildingState} from '../../entity/components/building';
import {IConstructibleState} from '../../entity/components/constructible';
import {MapTile} from '../../map/tile';
import {ChildStatus} from '../../b3/core/child-status';

interface DebugPanelProps {
    tile: MapTile;
    agent: string;
    resource: string;
    item: string;
    building: IBuildingState;
    buildingConstructible: IConstructibleState;
    executionChain: ChildStatus[];
}

interface DebugPanelState {
    collisionDebugToggle: boolean;
}

export class DebugPanel extends React.Component<DebugPanelProps, DebugPanelState> {
    constructor(props: DebugPanelProps) {
        super(props);
        this.state = {
            collisionDebugToggle: false
        };
    }
    render () {
        const executionChain = this.props.executionChain;
        const lastAction = executionChain && executionChain.length ?
            executionChain[executionChain.length - 1].child.constructor.name :
            null;

        // So we can reference properties when this.props.building is undefined
        // Really wish we had a null-coalescing operator
        const building = (() => this.props.building || {} as BuildingInfo)();

        return (
        <div className="debug-ui">
            <h4>Tile: {this.props.tile && this.props.tile.toString()}</h4>
            <h4>Agent: {this.props.agent}</h4>
            <h4>Last Action: {lastAction}</h4>
            <h4>Item: {this.props.item}</h4>
            <h4>Resource: {this.props.resource}</h4>
            <h4>Building Info:</h4>
            <ul>
                { Object.keys(building).map(property =>
                    <li key={property}>{property}: {JSON.stringify(building[property])}</li>
                ) }
                <li>{this.props.buildingConstructible &&
                    this.props.buildingConstructible.resourceRequirements.toString()}</li>
            </ul>
            <h4>Collision Debug: <input onClick={() => this.setState({
                collisionDebugToggle: !this.state.collisionDebugToggle
            })} type="checkbox"/></h4>
            <CollisionDebugView show={this.state.collisionDebugToggle}/>
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
        executionChain: state.hoveredAgentLastExecutionChain,
        building: state.hoveredBuildingState,
        buildingConstructible: state.hoveredBuildingConstructibleState
    };
})(DebugPanel);