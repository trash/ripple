import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

export interface ICorpseState {
    agentBaseSpriteName: string;

    sprite?: PIXI.Sprite;
}

export const Corpse: IComponent<ICorpseState> = {
    name: 'corpse',
    enum: Component.Corpse,
    getInitialState: () => {
        return {
            sprite: null,
            agentBaseSpriteName: null
        };
    }
}