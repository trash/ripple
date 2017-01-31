import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

export interface IHealthState {
    maxHealth: number;
    currentHealth: number;
}

export interface IHealthComponent extends IComponent {
    state: IHealthState;
}

export const Health: IHealthComponent = {
    name: 'health',
    enum: Component.Health,
    state: {
        currentHealth: null,
        maxHealth: null
    }
};