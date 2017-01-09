import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';

import {constants} from '../../data/constants';

export interface IHungerState {
    min: number;
    max: number;
    value: number;
}

export interface IHungerComponent extends IComponent {
    state: IHungerState;
}

export let Hunger: IHungerComponent = {
    name: 'hunger',
    enum: ComponentEnum.Hunger,
    state: {
        max: constants.HUNGER.MAX,
	    min: 0,
        value: null
    }
};