import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

export interface INameState {
    name?: string;
    isStatic? : boolean;
}

export interface INameComponent extends IComponent {
    state: INameState;
}

export let Name: INameComponent = {
    name: 'name',
    enum: Component.Name,
    state: {
        name: null,
        isStatic: false
    }
};