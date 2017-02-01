import * as React from 'react';

import {keybindings} from '../../services/keybindings';
import {cursorManager} from '../../ui/cursorManager';
import {Cursor} from '../../ui/Cursor';
import {GameMap} from '../../map';
import {events} from '../../events';
import {positionUtil} from '../../entity/util/position';
import {Component} from '../../entity/ComponentEnum';

const globalRefs: {
	map: GameMap
} = {
	map: null
};
events.on('map-update', (map: GameMap) => {
	globalRefs.map = map;
});

export class KillEntityService {
	active: boolean;
	entityType: Component;
	listenerOff: () => void;

	constructor () {
		this.active = false;
		keybindings.addKeyListener('escape', () => this.off());
		this.entityType = null;
	}

	on (type: Component) {
		this.active = true;
		this.entityType = type;
		cursorManager.showCursor(Cursor.Attack);
		this.listenerOff = globalRefs.map.addTileClickListener(tile =>
            positionUtil.destroyEntityOfComponentTypeInTile(
                tile,
                this.entityType));
	}

	off () {
		if (!this.active) {
			return;
		}
		this.active = false;
		cursorManager.hideCursor();
		this.listenerOff();
	}

	toggle (type: Component) {
		if (this.active) {
			return this.off();
		}
		this.on(type);
	}
}

const killEntityService = new KillEntityService();

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
        <div>{actions.map(action => {
            return <button key={action.name}
                onClick={() => killEntityService.toggle(action.action)}
            >{action.name}</button>
        })}</div>
        );
    }
}