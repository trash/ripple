import _ = require('lodash');
import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {IItemState} from '../components/item';
import {INameState} from '../components/name';
import {IRenderableState} from '../components/renderable';
import {IPositionState} from '../components/position';
import {util} from '../../util';
import {events} from '../../events';
import {constants} from '../../data/constants';
import {IRowColumnCoordinates} from '../../interfaces';
import {spriteManager} from '../../services/sprite-manager';

export class ItemSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Renderable, id) as IRenderableState,
                itemState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Item, id) as IItemState,
                nameState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Name, id) as INameState,
                positionState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Position, id) as IPositionState;

            if (renderableState.spriteGroup && !renderableState.sprite) {
                renderableState.spriteGroup = spriteManager.createContainer(0, 0);
                renderableState.sprite = this.createSprite(itemState);
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
        var nearestEmptyTile = positionState.tile;

		// nearestEmptyTile.addItem(this);

		// Create a new hauler task for this item if there is storage space available and it's storable
		events.emit(['item', 'spawn'], this);

        const sprite = renderableState.sprite;
        spriteManager.changePosition(sprite, nearestEmptyTile.column, nearestEmptyTile.row);
        sprite.visible = true;

        itemState.hasBeenSpawned = true;

		// if (this.tile.isStorage()) {
			// this.storeToTile(null);
		// }
    }

    createSprite (itemState: IItemState) {
        // Just default to first row initially
		const sprite = spriteManager.create(itemState.spriteName, 0, 0);

		sprite.visible = false;
		// for tooltips
		sprite.interactive = true;

        return sprite;
    }
}