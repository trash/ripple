import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

export interface IHealthBarState {
    size: number;
    shown?: boolean;
    positionX?: number;
    positionY?: number;
    sprites?: PIXI.Sprite[];
    percentageFilled?: number;
    // auto hide stuff
    autoHideTimeout?: number;
}

export interface IHealthBarComponent extends IComponent {
    state: IHealthBarState;
}

export let HealthBar: IHealthBarComponent = {
    name: 'health-bar',
    enum: Component.HealthBar,
    state: {
        size: 5,
        shown: false,
        positionX: null,
        positionY: null,
        sprites: null,
        percentageFilled: 0,
        // auto hide stuff
        autoHideTimeout: null,
    }
};