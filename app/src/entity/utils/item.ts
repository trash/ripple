import {gameManager} from '../../game/game-manager';
import {ComponentEnum} from '../component-enum';
import {IPositionState} from '../components/position';
import {IItemState} from '../components/item';
import {IRenderableState} from '../components/renderable';
import {events} from '../../events';

export class ItemUtil {
    removeFromTile (id: number) {
        const positionState = gameManager.entityManager.getComponentDataForEntity(
                ComponentEnum.Position, id) as IPositionState,
            itemState = gameManager.entityManager.getComponentDataForEntity(
                ComponentEnum.Item, id) as IItemState,
            renderableState = gameManager.entityManager.getComponentDataForEntity(
                ComponentEnum.Renderable, id) as IRenderableState,
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