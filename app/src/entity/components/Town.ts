import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

export interface ITownState {
    gold: number;
}

export const Town: IComponent<ITownState> = {
    name: 'town',
    enum: Component.Town,
    getInitialState: () => {
        return {
            gold: 0
        };
    }
};