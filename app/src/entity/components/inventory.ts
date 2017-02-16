import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {ICoordinates, IRowColumnCoordinates} from '../../interfaces';

export interface IInventoryState {
    items: number[];
    gold?: number;
}

export interface IInventoryComponent extends IComponent {
    state: IInventoryState;
}

export const Inventory: IInventoryComponent = {
    name: 'inventory',
    enum: Component.Inventory,
    state: {
        items: [],
        gold: 0
    }
};