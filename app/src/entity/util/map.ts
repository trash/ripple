import {globalRefs} from '../../globalRefs';
import {BaseUtil} from './base';

export class MapUtil extends BaseUtil {
    getTile (x: number, y: number) {
        return globalRefs.map.getTile(x, y);
    }
    updateCollisionGrid () {
        globalRefs.map.grid(true);
    }
}

export const mapUtil = new MapUtil();