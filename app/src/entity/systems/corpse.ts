import TWEEN = require('tween.js');
import {EntitySystem, EntityManager} from '../entityManager';
import {IRenderableState} from '../components';
import {IPositionState} from '../components';
import {ICorpseState} from '../components';
import {ICoordinates} from '../../interfaces';
import {util} from '../../util';
import {TilemapSprite} from '../../tilemap';
import {constants} from '../../data/constants';
import {Components} from '../ComponentsEnum';
import {gameClock} from '../../game/game-clock';

export class CorpseSystem extends EntitySystem {
    update (entityIds: number[], turn: number) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
					Components.Renderable, id) as IRenderableState,
                corpseState = this.manager.getComponentDataForEntity(
					Components.Corpse, id) as ICorpseState,
				positionState = this.manager.getComponentDataForEntity(
					Components.Position, id) as IPositionState;

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