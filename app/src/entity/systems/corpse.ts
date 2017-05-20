import {EntitySystem, EntityManager} from '../entityManager';
import {
    IRenderableState,
    IPositionState,
    ICorpseState
} from '../components';
import {XYCoordinates} from '../../interfaces';
import {util} from '../../util';
import {TilemapSprite} from '../../tilemap';
import {constants} from '../../data/constants';
import {Component} from '../ComponentEnum';
import {SpriteManager} from '../../services/spriteManager';

export class CorpseSystem extends EntitySystem {
    update (entityIds, turn, stopped, clock) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
                Component.Renderable, id) as IRenderableState;
            const corpseState = this.manager.getComponentDataForEntity(
				Component.Corpse, id) as ICorpseState;
            const positionState = this.manager.getComponentDataForEntity(
				Component.Position, id) as IPositionState;

            if (renderableState.spriteGroup && !renderableState.sprite) {
                renderableState.sprite = SpriteManager.Sprite.fromFrame(
                    `${corpseState.agentBaseSpriteName}-corpse`);
                renderableState.spriteGroup.addChild(renderableState.sprite);
                clock.timer(72, () => {
                    this.manager.destroyEntity(id);
                });
            }
        });
    }
}