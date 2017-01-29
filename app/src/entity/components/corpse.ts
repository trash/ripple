import {IComponent} from '../entityManager';
import {Components} from '../ComponentsEnum';

export interface ICorpseState {
    agentBaseSpriteName: string;

    sprite?: PIXI.Sprite;
}

export interface ICorpseComponent extends IComponent {
    state: ICorpseState;
}

export let Corpse: ICorpseComponent = {
    name: 'corpse',
    enum: Components.Corpse,
    state: {
        sprite: null,
        agentBaseSpriteName: null
    }
}