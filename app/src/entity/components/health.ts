import {IComponent} from '../entityManager';
import {Components} from '../ComponentsEnum';

export interface IHealthState {
    maxHealth: number;
    currentHealth: number;
}

export interface IHealthComponent extends IComponent {
    state: IHealthState;
}

export const Health: IHealthComponent = {
    name: 'health',
    enum: Components.Health,
    state: {
        currentHealth: null,
        maxHealth: null
    }
};