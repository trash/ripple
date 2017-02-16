import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {Item as ItemEnum} from '../../data/Item';
import {ItemProperty} from '../../data/ItemProperty';

export interface IItemState {
    enum?: ItemEnum,
    name?: string;
    readableName?: string;
    description?: string;
    shouldBeSpawned?: boolean;
    hasBeenSpawned?: boolean;
    claimed?: boolean;
    properties?: ItemProperty[]
    toBeStored?: boolean;
    stored?: number;
    value?: number;
    haulerTask?: number;
    forSale?: boolean;
}

export const Item: IComponent<IItemState> = {
    name: 'item',
    enum: Component.Item,
    getInitialState: () => {
        return {
            enum: null,
            name: null,
            readableName: null,
            description: null,
            shouldBeSpawned: false,
            hasBeenSpawned: false,
            claimed: false,
            properties: [],
            toBeStored: false,
            stored: null,
            value: 1,
            haulerTask: null,
            forSale: false
        };
    }
};