import * as _ from 'lodash';
import * as React from 'react'
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {CollisionDebugView} from './collisionDebugView';
import {Map} from 'immutable';
import {util} from '../../util';

import {
    IHungerState,
    ISleepState,
    IAgentState,
    IItemState,
    IResourceState,
    IBuildingState,
    IConstructibleState,
    Constructible,
    IPositionState,
    IVillagerState
} from '../../entity/components';

import {MapTile} from '../../map/tile';
import {ChildStatus} from '../../b3/Core';

type PlainObject = {
    [key: string]: any;
}

interface DebugPanelProps {
    tile: MapTile;
    agent: IAgentState;
    agentHunger: IHungerState;
    agentSleep: ISleepState;
    agentPosition: IPositionState;
    resource: IResourceState;
    item: IItemState;
    building: IBuildingState;
    villager: IVillagerState;
    buildingConstructible: IConstructibleState;
    executionChain: ChildStatus[];
    hours: number;
    days: number;
}

interface DebugPanelState {
    collisionDebugToggle?: boolean;
    hiddenDebugGroups?: Map<string, boolean>;
    editingComponentProperties?: Map<string, boolean>;
    componentPropertiesValues?: Map<string, any>;
}

export class DebugPanel extends React.Component<DebugPanelProps, DebugPanelState> {

    constructor(props: DebugPanelProps) {
        super(props);
        this.state = {
            collisionDebugToggle: false,
            hiddenDebugGroups: Map<string, boolean>(),
            editingComponentProperties: Map<string, boolean>(),
            componentPropertiesValues: Map<string, any>()
        };
    }

    getComponentPropertyKey (
        componentName: string,
        property: string
    ): string {
        return `${componentName}:${property}`;
    }

    hideDebugGroup(title: string) {
        const hidden = this.state.hiddenDebugGroups.get(title);
        this.setState({
            hiddenDebugGroups: this.state.hiddenDebugGroups.set(title, !hidden)
        });
    }

    editableDebugItemOnClick (
        event: React.MouseEvent<any>,
        editingKey: string,
        value: string,
        editing: boolean
    ) {
        this.setState({
            editingComponentProperties: this.state
                .editingComponentProperties.set(editingKey, !editing),
            componentPropertiesValues: this.state
                .componentPropertiesValues.set(editingKey, value)
        });
        // Focus the newly created input after it's been created
        if (!editing) {
            ((parentElement: Element) => {
                _.defer(() => parentElement.querySelector('input').focus());
            })((event.target as Element).parentElement);
        }
    }

    editableDebugItemOnChange (
        event: React.ChangeEvent<HTMLInputElement>,
        inputType: string,
        editingKey: string
    ) {
        let newValue: any;
        switch (inputType) {
            case 'checkbox':
                newValue = event.target.checked;
                break;
            case 'text':
            case 'number':
            default:
                newValue = event.target.value;
                break;
        }
        const newState = this.state.componentPropertiesValues.set(editingKey, newValue);
        this.setState({
            componentPropertiesValues: newState
        });
    }

    editableDebugItemOnSave (
        editingKey: string,
        object: any,
        property: string
    ) {
        let newValue = this.state.componentPropertiesValues.get(editingKey);
        newValue = util.coerceToOriginalType(object[property], newValue);
        // Update the actual component state
        object[property] = newValue;
        // Close input on save
        this.setState({
            editingComponentProperties: this.state.editingComponentProperties.set(editingKey, false)
        });
    }

    private valueToInputType (value: any): string {
        switch (typeof value) {
            case 'number':
                return 'number';
            case 'boolean':
                return 'checkbox';
            case 'string':
            default:
                return 'text';
        }
    }

    editableDebugGroupListItem(
        title: string,
        object: any,
        property: string
    ): JSX.JSXElement {
        const editingKey = this
            .getComponentPropertyKey(title, property);
        const editing = this.state
            .editingComponentProperties.get(editingKey);
        const value = object[property];
        const editingValue = this.state
            .componentPropertiesValues.get(editingKey);
        const inputType = this.valueToInputType(value);
        const itemOnClick = (e: React.MouseEvent<any>) =>
                this.editableDebugItemOnClick(
                    e, editingKey, value, editing);
        const saveCallback = () => this.editableDebugItemOnSave(
            editingKey, object, property);
        return (
        <li key={property}
            onClick={event => {
                event.preventDefault();
                event.stopPropagation();
            }}>
            <span onClick={itemOnClick}
                >{property}:</span>
            { !editing
                ? <span onClick={itemOnClick}>{JSON.stringify(value)}</span>
                : <form onSubmit={saveCallback}>
                    <input type={inputType}
                        value={editingValue}
                        checked={editingValue}
                        onChange={e =>
                            this.editableDebugItemOnChange(
                                e,
                                inputType,
                                editingKey)
                        }/>
                    <button onClick={saveCallback}
                        >Save</button>
                </form>}
        </li>
        );
    }

    renderEditableDebugGroup (
        title: string,
        object: any,
        blacklistedProperties: string[] = []
    ) {
        const hidden = this.state.hiddenDebugGroups.get(title);

        let properties = object
            ? Object.keys(object)
            : [];
        properties = _.difference(properties, blacklistedProperties);
        return (
            <div key={title}
                onClick={() => this.hideDebugGroup(title)}>
                <h5>{`${title} [${hidden ? `+${properties.length}` : '-'}]`}</h5>
                {!hidden &&
                    <ul>
                    { properties.map(property => {
                        return this.editableDebugGroupListItem(
                            title,
                            object,
                            property
                        );
                    })}
                    </ul>
                }
            </div>
        );
    }

    renderDebugGroup (
        title: string,
        values: string[],
        entryOnClick: (
            e: React.MouseEvent<HTMLLIElement>,
            value: string
        ) => void = ()=>{}
    ) {
        const hidden = this.state.hiddenDebugGroups.get(title);
        return (
            <div onClick={() => this.hideDebugGroup(title)}>
                <h5>{`${title} [${hidden ? `+${values.length}` : '-'}]`}</h5>
                {!hidden &&
                    <ul>
                    { values.map(value =>
                        <li key={value}
                            onClick={e => entryOnClick(e, value)}
                        >{value}</li>
                    )}
                    </ul>
                }
            </div>
        );
    }

    getDebugGroups (): [string, any, string[]][] {
        return [
            ['Agent', this.props.agent, []],
            ['Agent Position', this.props.agentPosition, []],
            ['Villager', this.props.villager, []],
            ['Agent Hunger', this.props.agentHunger, []],
            ['Agent Sleep', this.props.agentSleep, []],
            ['Item', this.props.item, []],
            ['Resource', this.props.resource, []],
            ['Building Info', this.props.building, []],
            ['Building Constructible', this.props.buildingConstructible,
                Constructible.blacklistedDebugProperties],
        ];
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
                [this.props.tile
                    && this.props.tile.toString()
                    || 'Tile'])}
            {this.getDebugGroups().map(([title, data, blacklistedProperties]) =>
                this.renderEditableDebugGroup(title, data, blacklistedProperties))}
            {this.renderDebugGroup('Last Action',
                [lastAction])}
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
        days: state.days,
        villager: state.hoveredVillager
    };
})(DebugPanel);