import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

export interface IHealthState {
    maxHealth: number;
    currentHealth: number;
}

export const Health: IComponent<IHealthState> = {
    name: 'health',
    enum: Component.Health,
    getInitialState: () => {
        return {
            currentHealth: null,
            maxHealth: null
        };
    }
};