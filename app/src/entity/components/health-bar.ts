import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';

export interface IHealthBarState {
    size: number;
    shown?: boolean;
    positionX?: number;
    positionY?: number;
    sprites?: PIXI.Sprite[];
    percentageFilled?: number;
}

export interface IHealthBarComponent extends IComponent {
    state: IHealthBarState;
}

export let HealthBar: IHealthBarComponent = {
    name: 'health-bar',
    enum: ComponentEnum.HealthBar,
    state: {
        size: 5,
        shown: false,
        positionX: null,
        positionY: null,
        sprites: null,
        percentageFilled: 0
    }
};