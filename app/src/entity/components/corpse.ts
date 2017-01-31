import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

export interface ICorpseState {
    agentBaseSpriteName: string;

    sprite?: PIXI.Sprite;
}

export interface ICorpseComponent extends IComponent {
    state: ICorpseState;
}

export let Corpse: ICorpseComponent = {
    name: 'corpse',
    enum: Component.Corpse,
    state: {
        sprite: null,
        agentBaseSpriteName: null
    }
}