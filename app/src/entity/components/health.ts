import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';

export interface IHealthState {
    maxHealth: number;
    currentHealth: number;
}

export interface IHealthComponent extends IComponent {
    state: IHealthState;
}

export let Health: IHealthComponent = {
    name: 'health',
    enum: ComponentEnum.Health,
    state: {
        currentHealth: null,
        maxHealth: null
    }
};