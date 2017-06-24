import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

export interface IEquipsArmorState {
    armor: number;
}

export const EquipsArmor: IComponent<IEquipsArmorState> = {
    name: 'equips-armor',
    enum: Component.EquipsArmor,
    getInitialState: () => {
        return {
            armor: null
        };
    }
};