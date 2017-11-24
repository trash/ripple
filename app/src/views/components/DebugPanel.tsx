import * as _ from 'lodash';
import * as React from 'react'
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {toggleShowCollisionDebug} from '../../redux/actions';
import {Map} from 'immutable';
import {util} from '../../util';
import {behaviorTreeUtil} from '../../entity/util';
import {events} from '../../events';
import {taskQueueManager} from '../../Tasks/TaskQueueManager';

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
    IVillagerState,
    Villager,
    Visitor,
    IStorageState,
    IStatusBubbleState,
    IHealthState,
    IVisitorState,
    IHarvestableState,
    IInventoryState
} from '../../entity/components';

import {MapTile} from '../../map/tile';
import {ChildStatus} from '../../b3/Core';

type PlainObject = {
    [key: string]: any;
}

interface DebugPanelProps {
    entity: number;
    tile: MapTile;
    agent: IAgentState;
    agentHunger: IHungerState;
    agentSleep: ISleepState;
    agentPosition: IPositionState;
    agentStatusBubble: IStatusBubbleState;
    resource: IResourceState;
    item: IItemState;
    itemPosition: IPositionState;
    building: IBuildingState;
    villager: IVillagerState;
    buildingConstructible: IConstructibleState;
    executionChain: ChildStatus[];
    hours: number;
    days: number;
    storage: IStorageState;
    health: IHealthState;
    harvestable: IHarvestableState;
    visitor: IVisitorState;
    inventory: IInventoryState;
    collisionDebugToggle: boolean;
}

interface DebugPanelState {
    tilemapDebug?: boolean;
    hiddenDebugGroups?: Map<string, boolean>;
    editingComponentProperties?: Map<string, boolean>;
    componentPropertiesValues?: Map<string, any>;
}

export class DebugPanel extends React.Component<DebugPanelProps, DebugPanelState> {

    constructor(props: DebugPanelProps) {
        super(props);
        this.state = {
            tilemapDebug: false,
            hiddenDebugGroups: Map<string, boolean>(),
            editingComponentProperties: Map<string, boolean>(),
            componentPropertiesValues: Map<string, any>()
        };
    }

    toggleTilemapDebug() {
        const on = !this.state.tilemapDebug;
        this.setState({
            tilemapDebug: on
        });
        events.emit('toggle-tilemap-debug', on);
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
    ): JSX.Element {
        const editingKey = this.getComponentPropertyKey(title, property);
        const editing = this.state.editingComponentProperties.get(editingKey);
        const value = object[property];
        const editingValue = this.state.componentPropertiesValues.get(editingKey);
        const inputType = this.valueToInputType(value);
        const itemOnClick = (e: React.MouseEvent<any>) =>
                this.editableDebugItemOnClick(
                    e, editingKey, value, editing
                );
        const saveCallback = () => this.editableDebugItemOnSave(
            editingKey, object, property
        );

        const valueString = util.isPrimitive(value)
            ? JSON.stringify(value)
            : value.toString();
        return (
        <li key={property}
            onClick={event => {
                event.preventDefault();
                event.stopPropagation();
            }}>
            <span onClick={itemOnClick}
                >{property}:</span>
            { !editing
                ? <span onClick={itemOnClick}>{valueString}</span>
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
            ['Entity', { id: this.props.entity }, []],
            ['Agent', this.props.agent, []],
            ['Health', this.props.health, []],
            ['Agent Position', this.props.agentPosition, []],
            ['Agent Status Bubble', this.props.agentStatusBubble, []],
            ['Villager', this.props.villager, Villager.blacklistedDebugProperties],
            ['Visitor', this.props.visitor, Visitor.blacklistedDebugProperties],
            ['Inventory', this.props.inventory, []],
            ['Agent Hunger', this.props.agentHunger, []],
            ['Agent Sleep', this.props.agentSleep, []],
            ['Item', this.props.item, []],
            ['Item Position', this.props.itemPosition, []],
            ['Resource', this.props.resource, []],
            ['Harvestable', this.props.harvestable, []],
            ['Storage', this.props.storage, []],
            ['Building Info', this.props.building, []],
            ['Building Constructible', this.props.buildingConstructible,
                Constructible.blacklistedDebugProperties],
        ];
    }

    render () {
        const lastAction = behaviorTreeUtil.getLastActionNameFromExecutionChain(
            this.props.executionChain
        );

        // So we can reference properties when this.props.building is undefined
        // Really wish we had a null-coalescing operator
        const building = (() => this.props.building || {} as IBuildingState)();

        return (
        <div className="debug-ui">
            <h5>Tilemap Debug:
                <input onClick={() => this.toggleTilemapDebug()} checked={this.state.tilemapDebug} type="checkbox"/></h5>
            <h5>Collision Debug:
                <input checked={this.props.collisionDebugToggle} onClick={() => store.dispatch(toggleShowCollisionDebug())} type="checkbox"/>
            </h5>
            {this.renderDebugGroup('Tile',
                [this.props.tile
                    && this.props.tile.toString()
                    || 'Tile'])}
            {this.getDebugGroups().map(([title, data, blacklistedProperties]) =>
                this.renderEditableDebugGroup(title, data, blacklistedProperties))}
            {this.renderDebugGroup('Last Action',
                [lastAction])}
            {this.renderDebugGroup('Task Queues',
                taskQueueManager.getAllTaskQueues()
                    .map(taskQueue => `${taskQueue.type}:${taskQueue.tasks.length}`))}
        </div>
        );
    }
}

export const ConnectedDebugPanel = connect((state: StoreState) => {
    return {
        entity: state.hoveredEntity,
        tile: state.tile,
        agent: state.hoveredAgent,
        agentHunger: state.hoveredAgentHunger,
        agentSleep: state.hoveredAgentSleep,
        agentPosition: state.hoveredAgentPosition,
        agentStatusBubble: state.hoveredAgentStatusBubble,
        visitor: state.hoveredVisitor,
        inventory: state.hoveredInventory,
        item: state.hoveredItem,
        itemPosition: state.hoveredItemPosition,
        resource: state.hoveredResource,
        executionChain: state.hoveredAgentLastExecutionChain,
        building: state.hoveredBuildingState,
        buildingConstructible: state.hoveredBuildingConstructibleState,
        hours: state.hours,
        days: state.days,
        villager: state.hoveredVillager,
        storage: state.hoveredStorage,
        health: state.hoveredHealth,
        harvestable: state.hoveredHarvestable,
        collisionDebugToggle: state.showCollisionDebug
    };
}, function(){return{}} as any)(DebugPanel);