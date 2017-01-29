import {IComponent} from '../entityManager';
import {Components} from '../ComponentsEnum';

import {constants} from '../../data/constants';

export interface ISleepState {
    min: number;
    max: number;
    value: number;
    isSleeping: boolean;
    inHome: boolean;
}

export interface ISleepComponent extends IComponent {
    state: ISleepState;
}

export let Sleep: ISleepComponent = {
    name: 'sleep',
    enum: Components.Sleep,
    state: {
        max: constants.SLEEP.MAX,
	    min: 0,
        value: 0,
        isSleeping: false,
        inHome: false
    }
};