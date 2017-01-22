import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {IItemState} from '../components';
import {INameState} from '../components';
import {IRenderableState} from '../components';
import {IPositionState} from '../components';
import {util} from '../../util';
import {events} from '../../events';
import {constants} from '../../data/constants';
import {IRowColumnCoordinates} from '../../interfaces';
import {spriteManager} from '../../services/sprite-manager';

export class ItemSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Renderable, id) as IRenderableState;
            const itemState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Item, id) as IItemState;
            const nameState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Name, id) as INameState;
            const positionState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Position, id) as IPositionState;

            if (renderableState.spriteGroup && !renderableState.sprite) {
                renderableState.sprite = this.createSprite(itemState);
                renderableState.spriteGroup.addChild(renderableState.sprite);
                renderableState.shown = false;
            }
            if (renderableState.sprite && itemState.shouldBeSpawned && !itemState.hasBeenSpawned) {
                this.spawn(itemState, renderableState, positionState);
            }
            if (!nameState.name) {
                nameState.name = itemState.readableName;
            }
        });
    }

    spawn (
        itemState: IItemState,
        renderableState: IRenderableState,
        positionState: IPositionState
    ) {
        const nearestEmptyTile = positionState.tile;

		// nearestEmptyTile.addItem(this);

		// Create a new hauler task for this item if there is storage space available and it's storable
        console.info('should be creating a hauler task for this item');

        spriteManager.changePosition(renderableState.spriteGroup, nearestEmptyTile.column,
            nearestEmptyTile.row);

        renderableState.shown = true;

        itemState.hasBeenSpawned = true;

		// if (this.tile.isStorage()) {
			// this.storeToTile(null);
		// }
    }

    createSprite (itemState: IItemState) {
        // Just default to first row initially
        const sprite = PIXI.Sprite.fromFrame(itemState.spriteName);

		// for tooltips
		sprite.interactive = true;

        return sprite;
    }
}