import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {IRowColumnCoordinates} from '../../interfaces';
import {ItemProperty} from '../../data/ItemProperty';

export interface IStorageState {
    tile?: IRowColumnCoordinates;
	available: number;
	total: number;
	itemList?: number[];
	hideWhenStored?: boolean;
	itemRestrictions?: ItemProperty[];
}

export const Storage: IComponent<IStorageState> = {
    name: 'storage',
    enum: Component.Storage,
    getInitialState: () => {
        return {
            tile: null,
            available: 0,
            total: 0,
            itemList: [],
            hideWhenStored: true,
            itemRestrictions: []
        };
    }
};