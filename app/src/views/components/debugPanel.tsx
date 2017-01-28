import React = require('react');
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {CollisionDebugView} from './collisionDebugView';

import {IHungerState} from '../../entity/components/hunger';
import {ISleepState} from '../../entity/components/sleep';
import {IAgentState} from '../../entity/components/agent';
import {IItemState} from '../../entity/components/item';
import {IResourceState} from '../../entity/components/resource';
import {IBuildingState} from '../../entity/components/building';
import {IConstructibleState} from '../../entity/components/constructible';
import {IPositionState} from '../../entity/components/position';

import {MapTile} from '../../map/tile';
import {ChildStatus} from '../../b3/Core';

interface DebugPanelProps {
    tile: MapTile;
    agent: IAgentState;
    agentHunger: IHungerState;
    agentSleep: ISleepState;
    agentPosition: IPositionState;
    resource: IResourceState;
    item: IItemState;
    building: IBuildingState;
    buildingConstructible: IConstructibleState;
    executionChain: ChildStatus[];
    hours: number;
    days: number;
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

    stringifiedList (object: any): string[] {
        if (!object) {
            return [];
        }
        return Object.keys(object).map(property =>
            `${property}: ${JSON.stringify(object[property])}`
        );
    }

    renderDebugGroup (title: string, values: string[]) {
        return (
            <div>
                <h5>{title}</h5>
                <ul>
                { values.map(value =>
                    <li>{value}</li>
                )}
                </ul>
            </div>
        );
    }

    render () {
        const executionChain = this.props.executionChain;
        const lastAction = executionChain && executionChain.length ?
            executionChain[executionChain.length - 1].child.constructor.name :
            null;

        // So we can reference properties when this.props.building is undefined
        // Really wish we had a null-coalescing operator
        const building = (() => this.props.building || {} as IBuildingState)();

        return (
        <div className="debug-ui">
            {this.renderDebugGroup('Tile',
                [this.props.tile && this.props.tile.toString()])}
            {this.renderDebugGroup('Agent',
                this.stringifiedList(this.props.agent))}
            {this.renderDebugGroup('Agent Position',
                this.stringifiedList(this.props.agentPosition))}
            {this.renderDebugGroup('Agent Hunger',
                this.stringifiedList(this.props.agentHunger))}
            {this.renderDebugGroup('Agent Sleep',
                this.stringifiedList(this.props.agentSleep))}
            {this.renderDebugGroup('Last Action',
                [lastAction])}
            {this.renderDebugGroup('Item',
                this.stringifiedList(this.props.item))}
            {this.renderDebugGroup('Resource',
                this.stringifiedList(this.props.resource))}
            {this.renderDebugGroup('Building Info',
                this.stringifiedList(this.props.building).concat(
                    this.props.buildingConstructible &&
                    this.props.buildingConstructible.resourceRequirements.toString()
                ))}
            <h5>Collision Debug: <input onClick={() => this.setState({
                collisionDebugToggle: !this.state.collisionDebugToggle
            })} type="checkbox"/></h5>
            <CollisionDebugView show={this.state.collisionDebugToggle}/>
        </div>
        );
    }
}

export const ConnectedDebugPanel = connect((state: StoreState) => {
    return {
        tile: state.tile,
        agent: state.hoveredAgent,
        agentHunger: state.hoveredAgentHunger,
        agentSleep: state.hoveredAgentSleep,
        agentPosition: state.hoveredAgentPosition,
        item: state.hoveredItem,
        resource: state.hoveredResource,
        executionChain: state.hoveredAgentLastExecutionChain,
        building: state.hoveredBuildingState,
        buildingConstructible: state.hoveredBuildingConstructibleState,
        hours: state.hours,
        days: state.days
    };
})(DebugPanel);