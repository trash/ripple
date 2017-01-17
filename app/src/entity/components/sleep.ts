import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';

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
    enum: ComponentEnum.Sleep,
    state: {
        max: constants.SLEEP.MAX,
	    min: 0,
        value: 0,
        isSleeping: false,
        inHome: false
    }
};