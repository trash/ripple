import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {ItemProperty, IRowColumnCoordinates} from '../../interfaces';

export interface IStorageState {
    tile?: IRowColumnCoordinates;
	available: number;
	total: number;
	itemList?: number[];
	hideWhenStored?: boolean;
	itemRestrictions?: ItemProperty[];
}

export interface IStorageComponent extends IComponent {
    state: IStorageState;
}

export const Storage: IStorageComponent = {
    name: 'storage',
    enum: Component.Storage,
    state: {
        tile: null,
        available: 0,
        total: 0,
        itemList: [],
        hideWhenStored: true,
        itemRestrictions: []
    }
};