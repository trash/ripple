import {BaseUtil} from './base';

export class PositionUtil extends BaseUtil {
    getTileFromEntityId (id: number) {
        return this._getPositionState(id).tile;
    }
}

export const positionUtil = new PositionUtil();