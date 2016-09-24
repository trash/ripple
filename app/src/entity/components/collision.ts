import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {ICoordinates} from '../../interfaces';

export interface ICollisionState {
    size: ICoordinates;
    entrance?: ICoordinates;
    previousActiveState?: boolean;
    activeState?: boolean;
}

export interface ICollisionComponent extends IComponent {
    state: ICollisionState;
}

export let Collision: ICollisionComponent = {
    name: 'collision',
    enum: ComponentEnum.Collision,
    state: {
        size: null,
        previousActiveState: false,
        activeState: true,
        entrance: null
    }
};