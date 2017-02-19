import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {XYCoordinates} from '../../interfaces';

export interface ICollisionState {
    size: XYCoordinates;
    entrance?: XYCoordinates;
    previousActiveState?: boolean;
    activeState?: boolean;
    updatesTile?: boolean;
}

export const Collision: IComponent<ICollisionState> = {
    name: 'collision',
    enum: Component.Collision,
    getInitialState: () => {
        return {
            size: null,
            previousActiveState: false,
            activeState: true,
            entrance: null,
            updatesTile: true
        };
    }
};