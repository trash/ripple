import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {ItemRequirements} from '../../ItemRequirements';
import {RequiredItems} from '../../interfaces';
import {Profession} from '../../data/Profession';

export interface ICraftableState {
    requiredResources: RequiredItems;
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