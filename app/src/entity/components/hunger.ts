import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

import {constants} from '../../data/constants';

export interface IHungerState {
    min?: number;
    max?: number;
    value: number;
}

export interface IHungerComponent extends IComponent {
    state: IHungerState;
}

export let Hunger: IHungerComponent = {
    name: 'hunger',
    enum: Component.Hunger,
    state: {
        max: constants.HUNGER.MAX,
	    min: 0,
        value: 0
    }
};