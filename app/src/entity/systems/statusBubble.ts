import * as _ from 'lodash';;
import {util} from '../../util';
import {StatusBubble} from '../../data/statusBubble';
import {EntitySystem, EntityManager} from '../entityManager';
import {Components} from '../ComponentsEnum';
import {IRenderableState} from '../components';
import {IStatusBubbleState} from '../components';

const CYCLE_TIME = 1000;

export class StatusBubbleSystem extends EntitySystem {
    lastCycle: number;

    constructor (manager: EntityManager, ComponentsEnum: Components) {
        super(manager, ComponentsEnum);
        this.lastCycle = performance.now();
    }

    update (entityIds: number[]) {
        entityIds.forEach(id => {
            // Only update once a cycle
            if (performance.now() - this.lastCycle < CYCLE_TIME) {
                return;
            }
            this.lastCycle = performance.now();

            const statusBubbleState = this.manager.getComponentDataForEntity(Components.StatusBubble, id) as IStatusBubbleState,
                renderableState = this.manager.getComponentDataForEntity(Components.Renderable, id) as IRenderableState;

            // Init active bubbleName
            if (!statusBubbleState.activeBubbleName) {
                statusBubbleState.activeBubbleName = statusBubbleState.activeBubbles[0];
            }
            // Remove previous active sprite
            const activeSprite = statusBubbleState.activeBubbleSprite;
            if (activeSprite) {
                renderableState.spriteGroup.removeChild(activeSprite);
                activeSprite.destroy();
                statusBubbleState.activeBubbleSprite = null;
            }

            // Cycle to next bubble
            const nextBubbleName = this.getNextBubbleName(statusBubbleState.activeBubbles, statusBubbleState.activeBubbleName);
            statusBubbleState.activeBubbleName = nextBubbleName;
            if (nextBubbleName) {
                const sprite = this.createSprite(nextBubbleName);
                statusBubbleState.activeBubbleSprite = sprite;
                renderableState.spriteGroup.addChild(sprite);
            }
        });
    }

    getNextBubbleName (activeBubbles: StatusBubble[], activeBubbleName: StatusBubble) {
        if (!activeBubbles.length) {
            return null;
        }
        let previousIndex = activeBubbles.indexOf(activeBubbleName);
        // Either the previous one is no longer in the list,
        // we've looped around the end, or there's only one option just pick the first one
        if (previousIndex === -1 ||
            previousIndex === activeBubbles.length - 1 ||
            activeBubbles.length === 1
        ) {
            return activeBubbles[0];
        }
        return activeBubbles[previousIndex + 1];
    }

    createSprite (bubbleName): PIXI.Sprite {
        const bubbleSprite = PIXI.Sprite.fromFrame('bubble-' + bubbleName);
        bubbleSprite.position.x = 0;
        bubbleSprite.position.y = -20;
        return bubbleSprite;
    }
}