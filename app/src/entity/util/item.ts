import {ComponentEnum} from '../component-enum';
import {IPositionState} from '../components/position';
import {IItemState} from '../components/item';
import {IRenderableState} from '../components/renderable';
import {events} from '../../events';
import {BaseUtil} from './base';

export class ItemUtil extends BaseUtil {
    removeFromTile (id: number) {
        const positionState = this._getPositionState(id),
            itemState = this._getItemState(id),
            renderableState = this._getRenderableState(id),
            tile = positionState.tile;

        // Free up storage space
        if (itemState.stored) {
            events.emit(['storage', 'unoccupy'], tile, id);
        }

        renderableState.sprite.visible = false;
        renderableState.shown = false;
        positionState.tile = null;
    }
}

export const itemUtil = new ItemUtil();