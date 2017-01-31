import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
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
    enum: Component.Collision,
    state: {
        size: null,
        previousActiveState: false,
        activeState: true,
        entrance: null,
        updatesTile: true
    }
};