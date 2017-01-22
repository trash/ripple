import {IComponent} from '../entityManager';
import {ComponentEnum} from '../componentEnum';

export interface ICorpseState {
    agentBaseSpriteName: string;

    sprite?: PIXI.Sprite;
}

export interface ICorpseComponent extends IComponent {
    state: ICorpseState;
}

export let Corpse: ICorpseComponent = {
    name: 'corpse',
    enum: ComponentEnum.Corpse,
    state: {
        sprite: null,
        agentBaseSpriteName: null
    }
}