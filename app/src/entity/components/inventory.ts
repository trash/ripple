import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {ICoordinates, IRowColumnCoordinates} from '../../interfaces';

export interface IInventoryState {
    items: number[];
    gold?: number;
}

export const Inventory: IComponent<IInventoryState> = {
    name: 'inventory',
    enum: Component.Inventory,
    getInitialState: () => {
        return {
            items: [],
            gold: 0
        };
    }
};