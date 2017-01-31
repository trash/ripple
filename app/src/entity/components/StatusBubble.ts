import {StatusBubble as StatusBubbleEnum} from '../../data/statusBubble';
import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
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
    enum: Component.StatusBubble,
    state: {
        activeBubbles: [],
        activeBubbleName: null,
        activeBubbleSprite: null
    }
};