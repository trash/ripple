import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {ItemProperty} from '../../interfaces';

export interface IItemState {
    name?: string;
    readableName?: string;
    description?: string;
    shouldBeSpawned?: boolean;
    hasBeenSpawned?: boolean;
    claimed?: boolean;
    properties?: ItemProperty[]
    toBeStored?: boolean;
    stored?: boolean;
    value?: number;
    haulerTask?: number;
}

export interface IItemComponent extends IComponent {
    state: IItemState;
}

export let Item: IItemComponent = {
    name: 'item',
    enum: Component.Item,
    state: {
        name: null,
        readableName: null,
        description: null,
        shouldBeSpawned: false,
        hasBeenSpawned: false,
        claimed: false,
        properties: [],
        toBeStored: false,
        stored: false,
        value: 1,
        haulerTask: null
    }
};