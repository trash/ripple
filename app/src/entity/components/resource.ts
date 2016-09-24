import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {Task} from '../../tasks/task';
import {Instance} from '../../tasks/instance';

type SpriteKey = ISpriteKeyMap | string[];

interface ISpriteKeyMap {
    [key: string]: number;
}

export interface IResourceState {
    name: string;
    anchor: [number, number];
    spriteKey: SpriteKey;
}

export interface IResourceComponent extends IComponent {
    state: IResourceState;
}

export let Resource: IResourceComponent = {
    name: 'resource',
    enum: ComponentEnum.Resource,
    state: {
        name: null,
        anchor: null,
        spriteKey: null
    }
};