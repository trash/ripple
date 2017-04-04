import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {Task} from '../../Tasks/Task';
import {Instance} from '../../Tasks/Instance';
import {Resource as ResourceEnum} from '../../Data/Resource';

type SpriteKey = ISpriteKeyMap | string[];

interface ISpriteKeyMap {
    [key: string]: number;
}

export interface IResourceState {
    enum: ResourceEnum;
    name: string;
    anchor: [number, number];
    spriteKey: SpriteKey;
}

export const Resource: IComponent<IResourceState> = {
    name: 'resource',
    enum: Component.Resource,
    getInitialState: () => {
        return {
            enum: null,
            name: null,
            anchor: null,
            spriteKey: null
        };
    }
};