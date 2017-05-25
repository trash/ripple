import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {XYCoordinates} from '../../interfaces';

export interface ICollisionState {
    size: XYCoordinates;
    entrance?: XYCoordinates;
    previousActiveState?: boolean;
    activeState?: boolean;
    updatesTile?: boolean;
    softCollision?: boolean;
}

export const Collision: IComponent<ICollisionState> = {
    name: 'collision',
    enum: Component.Collision,
    getInitialState: () => {
        return {
            size: {
                x: 1,
                y: 1
            },
            previousActiveState: false,
            activeState: true,
            entrance: null,
            updatesTile: true,
            softCollision: false
        };
    }
};