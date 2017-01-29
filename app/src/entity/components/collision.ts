import {IComponent} from '../entityManager';
import {Components} from '../ComponentsEnum';
import {ICoordinates} from '../../interfaces';

export interface ICollisionState {
    size: ICoordinates;
    entrance?: ICoordinates;
    previousActiveState?: boolean;
    activeState?: boolean;
    updatesTile?: boolean;
}

export interface ICollisionComponent extends IComponent {
    state: ICollisionState;
}

export let Collision: ICollisionComponent = {
    name: 'collision',
    enum: Components.Collision,
    state: {
        size: null,
        previousActiveState: false,
        activeState: true,
        entrance: null,
        updatesTile: true
    }
};