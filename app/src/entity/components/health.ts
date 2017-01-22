import {IComponent} from '../entityManager';
import {ComponentEnum} from '../componentEnum';

export interface IHealthState {
    maxHealth: number;
    currentHealth: number;
}

export interface IHealthComponent extends IComponent {
    state: IHealthState;
}

export const Health: IHealthComponent = {
    name: 'health',
    enum: ComponentEnum.Health,
    state: {
        currentHealth: null,
        maxHealth: null
    }
};