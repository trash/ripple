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

export const StatusBubble: IComponent<IStatusBubbleState> = {
    name: 'status-bubble',
    enum: Component.StatusBubble,
    getInitialState: () => {
        return {
            activeBubbles: [],
            activeBubbleName: null,
            activeBubbleSprite: null
        };
    }
};