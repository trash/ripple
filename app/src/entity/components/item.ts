import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {ItemProperties} from '../../interfaces';

export interface IItemState {
    name?: string;
    readableName?: string;
    spriteName?: string;
    description?: string;
    shouldBeSpawned?: boolean;
    hasBeenSpawned?: boolean;
    claimed?: boolean;
    properties?: ItemProperties[]
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
    enum: ComponentEnum.Item,
    state: {
        name: null,
        readableName: null,
        spriteName: null,
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