import {StatusBubble as StatusBubbleEnum} from '../../data/StatusBubble';
import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {Task} from '../../Tasks/Task';
import {Instance} from '../../Tasks/Instance';

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