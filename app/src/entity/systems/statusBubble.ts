import * as _ from 'lodash';;
import {util} from '../../util';
import {StatusBubble} from '../../data/StatusBubble';
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';
import {IRenderableState} from '../components';
import {IStatusBubbleState} from '../components';
import {SpriteManager} from '../../services/spriteManager';

const CYCLE_TIME = 1000;

export class StatusBubbleSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const statusBubbleState = this.manager.getComponentDataForEntity(
                Component.StatusBubble, id) as IStatusBubbleState;
            // Only update once a cycle
            if (performance.now() - statusBubbleState.lastCycleTime < CYCLE_TIME) {
                return;
            }
            statusBubbleState.lastCycleTime = performance.now();

            const renderableState = this.manager.getComponentDataForEntity(
                Component.Renderable, id) as IRenderableState;

            // Don't do anything if renderable component hasn't bootstrapped
            if (!renderableState.spriteGroup) {
                return;
            }

            // Remove previous active sprite
            const activeSprite = statusBubbleState.activeBubbleSprite;
            if (activeSprite) {
                renderableState.spriteGroup.removeChild(activeSprite);
                activeSprite.destroy();
                statusBubbleState.activeBubbleSprite = null;
            }
            if (!statusBubbleState.activeBubbles.length) {
                return;
            }

            // Cycle to next bubble
            const nextBubbleName = this.getNextBubbleName(
                statusBubbleState.activeBubbles,
                statusBubbleState.activeBubbleName
            );
            if (nextBubbleName !== null) {
                statusBubbleState.activeBubbleName = nextBubbleName;
                const sprite = this.createSprite(nextBubbleName);
                statusBubbleState.activeBubbleSprite = sprite;
                renderableState.spriteGroup.addChild(sprite);
            }
        });
    }

    getNextBubbleName (
        activeBubbles: StatusBubble[],
        activeBubbleName: StatusBubble
    ): StatusBubble {
        const previousIndex = activeBubbles.indexOf(activeBubbleName);
        // Either the previous one is no longer in the list,
        // we've looped around the end, or there's only one option just pick the first one
        if (previousIndex === -1
            || previousIndex === activeBubbles.length - 1
            || activeBubbles.length === 1
        ) {
            return activeBubbles[0];
        }
        return activeBubbles[previousIndex + 1];
    }

    createSprite (
        bubble: StatusBubble
    ): PIXI.Sprite {
        const bubbleName = StatusBubble[bubble].toLowerCase();
        const bubbleSprite = SpriteManager.Sprite.fromFrame(`bubble-${bubbleName}`);
        bubbleSprite.position.x = 0;
        bubbleSprite.position.y = -20;
        return bubbleSprite;
    }
}