import {StatusBubble as StatusBubbleEnum} from '../../data/status-bubble';
import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {Task} from '../../tasks/task';
import {Instance} from '../../tasks/instance';

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