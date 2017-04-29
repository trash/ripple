import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {XYCoordinates} from '../../interfaces';

export interface IRenderableState {
    sprite: PIXI.Sprite;
    spriteGroup: PIXI.Container;
    shown: boolean;
    dirty: boolean;
    lastSubContainerLayerIndex?: number;
    activeSubContainerTransition?: boolean;
    lastRenderedCoordinates: XYCoordinates;
}

export const Renderable: IComponent<IRenderableState> = {
    name: 'renderable',
    enum: Component.Renderable,
    getInitialState: () => {
        return {
            sprite: null,
            spriteGroup: null,
            shown: true,
            dirty: true,
            lastSubContainerLayerIndex: null,
            activeSubContainerTransition: false,
            lastRenderedCoordinates: null
        };
    }
}