import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

export interface INameState {
    name?: string;
    isStatic? : boolean;
}

export const Name: IComponent<INameState> = {
    name: 'name',
    enum: Component.Name,
    getInitialState: () => {
        return {
            name: null,
            isStatic: false
        };
    }
};