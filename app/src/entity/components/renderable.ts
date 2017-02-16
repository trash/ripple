import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

export interface IRenderableState {
    sprite: PIXI.Sprite;
    spriteGroup: PIXI.Container;
    shown: boolean;
}

export const Renderable: IComponent<IRenderableState> = {
    name: 'renderable',
    enum: Component.Renderable,
    getInitialState: () => {
        return {
            sprite: null,
            spriteGroup: null,
            shown: true
        };
    }
}