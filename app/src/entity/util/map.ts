import {events} from '../../events';
import {BaseUtil} from './base';
import {GameMap} from '../../map';

const globalRefs: {
	map: GameMap
} = {
	map: null
};
events.on('map-update', (map: GameMap) => {
	globalRefs.map = map;
});

export class MapUtil extends BaseUtil {
    getTile (x: number, y: number) {
        return globalRefs.map.getTile(x, y);
    }
    updateCollisionGrid () {
        globalRefs.map.grid(true);
    }
}

export const mapUtil = new MapUtil();