import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

export interface IArmorState {
    value: number;
}

export const Armor: IComponent<IArmorState> = {
    name: 'armor',
    enum: Component.Armor,
    getInitialState: () => {
        return {
            value: null
        };
    }
};