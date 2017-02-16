import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

import {constants} from '../../data/constants';

export interface ISleepState {
    min: number;
    max: number;
    value: number;
    isSleeping: boolean;
    inHome: boolean;
}

export const Sleep: IComponent<ISleepState> = {
    name: 'sleep',
    enum: Component.Sleep,
    getInitialState: () => {
        return {
            max: constants.SLEEP.MAX,
            min: 0,
            value: 0,
            isSleeping: false,
            inHome: false
        };
    }
};