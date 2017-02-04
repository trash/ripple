import {events} from '../events';
import {GameMap} from '../map';
import {Component} from '../entity/ComponentEnum';
import {positionUtil} from '../entity/util/position';
import {cursorManager} from '../ui/cursorManager';
import {keybindings} from '../services/keybindings';
import {Cursor} from '../ui/Cursor';

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

export const killEntityService = new KillEntityService();