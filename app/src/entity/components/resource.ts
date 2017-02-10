import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {Task} from '../../Tasks/Task';
import {Instance} from '../../Tasks/instance';

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
    enum: Component.Resource,
    state: {
        name: null,
        anchor: null,
        spriteKey: null
    }
};