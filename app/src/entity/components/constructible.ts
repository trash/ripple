import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {ResourceRequirements} from '../../ResourceRequirements';
import {RequiredResources} from '../../interfaces';

export interface IConstructibleState {
    requiredResources: RequiredResources;
    progressSpriteName: string;
    floorSpriteName: string;

    resourceRequirements?: ResourceRequirements;
    completedSpriteName?: string;
    progressSprite?: PIXI.Sprite;
    completedSprite?: PIXI.Sprite;
    floorSprite?: PIXI.Sprite;
    healthbarSpritesInitialized?: boolean;
    taskCreated?: boolean;
}

const blacklistedDebugProperties = [
    'completedSprite',
    'progressSprite',
    'floorSprite'
];

export interface IConstructibleComponent extends IComponent {
    state: IConstructibleState;
}

export let Constructible: IConstructibleComponent = {
    name: 'constructible',
    enum: Component.Constructible,
    blacklistedDebugProperties: blacklistedDebugProperties,
    state: {
        requiredResources: [],
        completedSpriteName: null,
        progressSpriteName: null,
        floorSpriteName: null,
        completedSprite: null,
        progressSprite: null,
        floorSprite: null,
        healthbarSpritesInitialized: false,
        taskCreated: false,
        resourceRequirements: null
    }
};