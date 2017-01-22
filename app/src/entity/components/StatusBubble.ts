import {StatusBubble as StatusBubbleEnum} from '../../data/status-bubble';
import {IComponent} from '../entityManager';
import {ComponentEnum} from '../componentEnum';
import {Task} from '../../Tasks/task';
import {Instance} from '../../Tasks/instance';

export interface IStatusBubbleState {
    activeBubbles: StatusBubbleEnum[];
    activeBubbleName: StatusBubbleEnum;
    activeBubbleSprite: PIXI.Sprite;
}

export interface IStatusBubbleComponent extends IComponent {
    state: IStatusBubbleState;
}

export let StatusBubble: IStatusBubbleComponent = {
    name: 'status-bubble',
    enum: ComponentEnum.StatusBubble,
    state: {
        activeBubbles: [],
        activeBubbleName: null,
        activeBubbleSprite: null
    }
};