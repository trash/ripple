import TWEEN = require('tween.js');
import {EntitySystem, EntityManager} from '../entity-manager';
import {IRenderableState} from '../components/renderable';
import {IPositionState} from '../components/position';
import {ICorpseState} from '../components/corpse';
import {ICoordinates} from '../../interfaces';
import {util} from '../../util';
import {TilemapSprite} from '../../tilemap';
import {constants} from '../../data/constants';
import {ComponentEnum} from '../component-enum';
import {gameClock} from '../../game/game-clock';

export class CorpseSystem extends EntitySystem {
    update (entityIds: number[], turn: number) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
					ComponentEnum.Renderable, id) as IRenderableState,
                corpseState = this.manager.getComponentDataForEntity(
					ComponentEnum.Corpse, id) as ICorpseState,
				positionState = this.manager.getComponentDataForEntity(
					ComponentEnum.Position, id) as IPositionState;

            if (renderableState.spriteGroup && !renderableState.sprite) {
                renderableState.sprite = PIXI.Sprite.fromFrame(
                    `${corpseState.agentBaseSpriteName}-corpse`);
                renderableState.spriteGroup.addChild(renderableState.sprite);
                gameClock.timer(72, () => {
                    this.manager.destroyEntity(id);
                });
            }
        });
    }
}