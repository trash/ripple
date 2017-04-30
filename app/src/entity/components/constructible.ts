import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {ItemRequirements} from '../../ItemRequirements';
import {RequiredItems} from '../../interfaces';

export interface IConstructibleState {
    requiredResources: RequiredItems;
    progressSpriteName?: string;
    floorSpriteName: string;

    resourceRequirements?: ItemRequirements;
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

export const Constructible: IComponent<IConstructibleState> = {
    name: 'constructible',
    enum: Component.Constructible,
    blacklistedDebugProperties: blacklistedDebugProperties,
    getInitialState: () => {
        return {
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
        };
    }
};