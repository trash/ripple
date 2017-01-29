import {IComponent} from '../entityManager';
import {Components} from '../ComponentsEnum';

export interface INameState {
    name?: string;
    isStatic? : boolean;
}

export interface INameComponent extends IComponent {
    state: INameState;
}

export let Name: INameComponent = {
    name: 'name',
    enum: Components.Name,
    state: {
        name: null,
        isStatic: false
    }
};