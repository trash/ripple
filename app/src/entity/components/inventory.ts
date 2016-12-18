import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {ICoordinates, IRowColumnCoordinates} from '../../interfaces';

export interface IInventoryState {
    items: number[];
}

export interface IInventoryComponent extends IComponent {
    state: IInventoryState;
}

export const Inventory: IInventoryComponent = {
    name: 'inventory',
    enum: ComponentEnum.Inventory,
    state: {
        items: []
    }
};