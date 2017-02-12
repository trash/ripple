import * as React from 'react';

import {Component} from '../../entity/ComponentEnum';
import {killEntityService} from '../../services/killEntityService';
import {events} from '../../events';
import {Agent} from '../../data/Agent';
import {Item} from '../../data/Item';

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

export class DebugBar extends React.Component<null, null> {
    render() {
        return (
        <div className="action-bar-buttons">
            {actions.map(action => {
                return <button key={action.name}
                    onClick={() => killEntityService.toggle(action.action)}
                >{action.name}</button>
            })}
            <button onClick={() => events.emit('spawnAgent', Agent.Zombie)}
                >Spawn Zombie</button>
            <button onClick={() => events.emit('spawnItem', Item.Wood)}
                >Spawn Item</button>
            <button onClick={() => events.emit('spawnItem', Item.Berries)}
                >Spawn Food</button>
        </div>
        );
    }
}