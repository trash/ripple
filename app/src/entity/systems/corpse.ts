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
import {gameClock} from '../../game/game-clock';
import {SpriteManager} from '../../services/spriteManager';

export class CorpseSystem extends EntitySystem {
    update (entityIds: number[], turn: number) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
					Component.Renderable, id) as IRenderableState,
                corpseState = this.manager.getComponentDataForEntity(
					Component.Corpse, id) as ICorpseState,
				positionState = this.manager.getComponentDataForEntity(
					Component.Position, id) as IPositionState;

            if (renderableState.spriteGroup && !renderableState.sprite) {
                renderableState.sprite = SpriteManager.Sprite.fromFrame(
                    `${corpseState.agentBaseSpriteName}-corpse`);
                renderableState.spriteGroup.addChild(renderableState.sprite);
                gameClock.timer(72, () => {
                    this.manager.destroyEntity(id);
                });
            }
        });
    }
}