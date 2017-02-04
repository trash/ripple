import * as React from 'react';

import {Component} from '../../entity/ComponentEnum';
import {killEntityService} from '../../services/killEntityService';

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
        <div className="action-bar-buttons">{actions.map(action => {
            return <button key={action.name}
                onClick={() => killEntityService.toggle(action.action)}
            >{action.name}</button>
        })}</div>
        );
    }
}