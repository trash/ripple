import * as React from 'react';
import {connect} from 'react-redux';

import {store, StoreState} from '../../redux/store';
import {showSpawnItemList} from '../../redux/actions';
import {IEntityComponentData} from '../../interfaces';
import {Component} from '../../entity/ComponentEnum';
import {killEntityService} from '../../services/killEntityService';
import {events} from '../../events';
import {Agent} from '../../data/Agent';
import {Item} from '../../data/Item';
import {ItemProperty} from '../../data/ItemProperty';

interface DebugBarProps {
    turn: number;
}

const actions = [
    {
        name: 'Destroy Agent',
        action: Component.Agent
    },
    {
        name: 'Destroy Item',
        action: Component.Item
    },
    {
        name: 'Destroy Building',
        action: Component.Building
    }
];

export class DebugBar extends React.Component<DebugBarProps, null> {
    render() {
        return (
        <div className="action-bar-buttons">
            {actions.map(action => {
                return <button key={action.name}
                    onClick={() => killEntityService.toggle(action.action)}
                >{action.name}</button>
            })}
            <button onClick={() => events.emit('spawnAgent', Agent.Villager, this.props.turn)}
                >Spawn Villager</button>
            <button onClick={() => events.emit('spawnAgent', Agent.Zombie, this.props.turn)}
                >Spawn Zombie</button>
            <button onClick={() => events.emit('spawnAgent', Agent.Visitor, this.props.turn, {
                } as IEntityComponentData)}
                >Spawn Visitor</button>
            <button onClick={() => events.emit('spawnAgent', Agent.Adventurer, this.props.turn, {
                } as IEntityComponentData)}
                >Spawn Adventurer</button>
            <button onClick={() => store.dispatch(showSpawnItemList())}
                >Spawn Item</button>
            <button onClick={() => events.emit('spawnItem', Item.Berries, this.props.turn)}
                >Spawn Food</button>
        </div>
        );
    }
}

export const ConnectedDebugBar = connect((state: StoreState) => {
    return {
        turn: state.gameTurn
    };
})(DebugBar);