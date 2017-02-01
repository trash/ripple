import * as React from 'react';

import {keybindings} from '../../services/keybindings';
import {cursorManager} from '../../ui/cursorManager';
import {Cursor} from '../../ui/Cursor';
import {GameMap} from '../../map';
import {events} from '../../events';

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
	type: string;
	listenerOff: () => void;

	constructor () {
		this.active = false;
		keybindings.addKeyListener('escape', () => this.off());
		this.type = null;
	}

	on (type: string) {
		this.active = true;
		this.type = type;
		cursorManager.showCursor(Cursor.Attack);
		this.listenerOff = globalRefs.map.addTileClickListener(tile => {
            console.log(`should be killing an entity of `
                +`type:${this.type} in tile:${tile}`)
		});
	};

	off () {
		if (!this.active) {
			return;
		}
		this.active = false;
		cursorManager.hideCursor();
		this.listenerOff();
	};

	toggle (type: string) {
		if (this.active) {
			return this.off();
		}
		this.on(type);
	};
};

const killEntityService = new KillEntityService();

const actions = [
    {
        name: 'Destroy Agent',
        action: 'kill-agent'
    },
    {
        name: 'Destroy Item',
        action: 'kill-item'
    },
    {
        name: 'Destroy Building',
        action: 'kill-building'
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