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
}

export interface IItemComponent extends IComponent {
    state: IItemState;
}

export let Item: IItemComponent = {
    name: 'item',
    enum: Component.Item,
    state: {
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
        haulerTask: null
    }
};