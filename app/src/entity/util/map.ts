import {events} from '../../events';
import {BaseUtil} from './base';
import {GameMap} from '../../map';

let map: GameMap;
events.on('map-update', (map: GameMap) => {
    map = map;
});

export class MapUtil extends BaseUtil {
    getTile (x: number, y: number) {
        return map.getTile(x, y);
    }
}

export const mapUtil = new MapUtil();