import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';
import {IItemState} from '../components';
import {INameState} from '../components';
import {IRenderableState} from '../components';
import {IPositionState} from '../components';
import {util} from '../../util';
import {events} from '../../events';
import {constants} from '../../data/constants';
import {Item} from '../../data/Item';
import {Profession} from '../../data/Profession';
import {IRowColumnCoordinates} from '../../interfaces';
import {spriteManager, SpriteManager} from '../../services/spriteManager';
import {store} from '../../redux/store';
import {addToItemList, removeFromItemList} from '../../redux/actions';
import {itemUtil, renderableUtil} from '../util';
import {taskQueueManager} from '../../Tasks/TaskQueueManager';

export class ItemSystem extends EntitySystem {
    constructor (manager: EntityManager, component: Component) {
        super(manager, component);

        events.on('add-item-to-requirements', (entity: number) => {
            this.destroyComponent(entity);
        })
    }

    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
                    Component.Renderable, id) as IRenderableState;
            const itemState = this.manager.getComponentDataForEntity(
                    Component.Item, id) as IItemState;
            const nameState = this.manager.getComponentDataForEntity(
                    Component.Name, id) as INameState;
            const positionState = this.manager.getComponentDataForEntity(
                    Component.Position, id) as IPositionState;

            if (!itemState.name && _.isNumber(itemState.enum)) {
                itemState.name = itemUtil.getItemNameFromEnum(itemState.enum);
            }

            if (renderableState.spriteGroup && !renderableState.sprite) {
                renderableState.sprite = this.createSprite(itemState);
                renderableState.spriteGroup.addChild(renderableState.sprite);
                renderableUtil.setShown(renderableState, false);
            }
            if (renderableState.sprite && itemState.shouldBeSpawned && !itemState.hasBeenSpawned) {
                this.spawn(id, itemState, renderableState, positionState);
            }
            if (!nameState.name) {
                nameState.name = itemState.readableName;
            }
        });
    }

    destroyComponent (id: number) {
        const itemState = this.manager.getComponentDataForEntity(
            Component.Item, id) as IItemState;
        store.dispatch(removeFromItemList(itemState.enum, itemState.claimed));
    }

    spawn (
        id: number,
        itemState: IItemState,
        renderableState: IRenderableState,
        positionState: IPositionState
    ) {
        const nearestEmptyTile = positionState.tile;

		// If it's claimed, create a new hauler task for this item if there
        // is storage space available and it's storable
        if (itemState.claimed) {
            const taskQueue = taskQueueManager.professionTaskQueue(Profession.Hauler);
            taskQueue.push([id]);
        }

        spriteManager.changePosition(renderableState.spriteGroup,
            nearestEmptyTile.column, nearestEmptyTile.row);

        renderableUtil.setShown(renderableState, true);

        itemState.shouldBeSpawned = false;
        itemState.hasBeenSpawned = true;
    }

    createSprite (itemState: IItemState) {
        // Just default to first row initially
        const sprite = SpriteManager.Sprite.fromFrame(itemState.name);

		// for tooltips
		sprite.interactive = true;

        return sprite;
    }
}