import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {IRowColumnCoordinates} from '../../interfaces';
import {ItemProperty} from '../../data/ItemProperty';
import {IStorageState, Storage} from './Storage';

export interface IShopState extends IStorageState {
}

export const Shop: IComponent<IShopState> = {
    name: 'shop',
    enum: Component.Shop,
    getInitialState: () => {
        const state = Storage.getInitialState();
        return state;
    }
};