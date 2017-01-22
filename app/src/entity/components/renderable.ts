import {IComponent} from '../entityManager';
import {ComponentEnum} from '../componentEnum';

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
    enum: ComponentEnum.Renderable,
    state: {
        sprite: null,
        spriteGroup: null,
        shown: true
    }
}