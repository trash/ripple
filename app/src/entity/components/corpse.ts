import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';

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