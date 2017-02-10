import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {ResourceRequirements} from '../../ResourceRequirements';
import {IRequiredResources} from '../../interfaces';
import {Profession} from '../../data/Profession';

export interface ICraftableState {
    requiredResources: IRequiredResources;
    craftTurns: number;
    profession: Profession;
}

export interface ICraftableComponent extends IComponent {
    state: ICraftableState;
}

export let Craftable: ICraftableComponent = {
    name: 'constructible',
    enum: Component.Craftable,
    state: {
        requiredResources: {},
        craftTurns: 1,
        profession: null
    }
};