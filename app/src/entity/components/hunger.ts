import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

import {constants} from '../../data/constants';

export interface IHungerState {
    min?: number;
    max?: number;
    value: number;
}

export const Hunger: IComponent<IHungerState> = {
    name: 'hunger',
    enum: Component.Hunger,
    getInitialState: () => {
        return {
            max: constants.HUNGER.MAX,
            min: 0,
            value: 0
        };
    }
};