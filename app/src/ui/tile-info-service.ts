import {GameMap} from '../map';
import {MapTile} from '../map/tile';
import {events} from '../events';
import {store} from '../redux/store';
import {updateHoverTile} from '../redux/actions/update-hover-tile';

export class TileInfoService {
    hoverListenerOff: Function;
    previousTile: MapTile;

    constructor () {
        events.on('map-update', (map: GameMap) => {
            this.updateMap(map);
        });
    }

    updateMap (map: GameMap) {
        this.hoverListenerOff = map.addTileHoverListener(this.onTileHover.bind(this));
		// this.clickListenerOff = map.addTileClickListener(this.onTileClick.bind(this));
    }

    onTileHover (tile: MapTile) {
		if (!tile || (this.previousTile && tile.isEqual(this.previousTile))) {
			return;
		}
        this.previousTile = tile;
        store.dispatch(updateHoverTile(tile));
	}
}

export const tileInfoService = new TileInfoService();