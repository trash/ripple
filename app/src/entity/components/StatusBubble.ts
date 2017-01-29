import {StatusBubble as StatusBubbleEnum} from '../../data/statusBubble';
import {IComponent} from '../entityManager';
import {Components} from '../ComponentsEnum';
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
    enum: Components.StatusBubble,
    state: {
        activeBubbles: [],
        activeBubbleName: null,
        activeBubbleSprite: null
    }
};