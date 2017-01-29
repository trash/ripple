import {IComponent} from '../entityManager';
import {Components} from '../ComponentsEnum';
import {ICoordinates, IRowColumnCoordinates} from '../../interfaces';

export interface IInventoryState {
    items: number[];
}

export interface IInventoryComponent extends IComponent {
    state: IInventoryState;
}

export const Inventory: IInventoryComponent = {
    name: 'inventory',
    enum: Components.Inventory,
    state: {
        items: []
    }
};