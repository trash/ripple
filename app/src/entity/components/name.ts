import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';

export interface INameState {
    name: string;
}

export interface INameComponent extends IComponent {
    state: INameState;
}

export let Name: INameComponent = {
    name: 'name',
    enum: ComponentEnum.Name,
    state: {
        name: null
    }
};