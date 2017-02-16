import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {ResourceRequirements} from '../../ResourceRequirements';
import {RequiredResources} from '../../interfaces';
import {Profession} from '../../data/Profession';

export interface ICraftableState {
    requiredResources: RequiredResources;
    craftTurns: number;
    profession: Profession;
}

export const Craftable: IComponent<ICraftableState> = {
    name: 'constructible',
    enum: Component.Craftable,
    getInitialState: () => {
        return {
            requiredResources: [],
            craftTurns: 1,
            profession: null
        };
    }
};