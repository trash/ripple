import {IComponent} from '../entityManager';
import {Components} from '../ComponentsEnum';

export interface IRenderableState {
    sprite: PIXI.Sprite;
    spriteGroup: PIXI.Container;
    shown: boolean;
}

export interface IRenderableComponent extends IComponent {
    state: IRenderableState;
}

export let Renderable: IRenderableComponent = {
    name: 'renderable',
    enum: Components.Renderable,
    state: {
        sprite: null,
        spriteGroup: null,
        shown: true
    }
}