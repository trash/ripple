import {IComponent} from '../entityManager';
import {ComponentEnum} from '../componentEnum';
import {ResourceRequirements} from '../../resource-requirements';
import {IRequiredResources} from '../../interfaces';

export interface IConstructibleState {
    requiredResources: IRequiredResources;
    resourceRequirements: ResourceRequirements;
    completedSpriteName: string;
    progressSpriteName: string;
    floorSpriteName: string;
    progressSprite: PIXI.Sprite;
    completedSprite: PIXI.Sprite;
    floorSprite: PIXI.Sprite;
    healthbarSpritesInitialized: boolean;
    taskCreated: boolean;
}

export interface IConstructibleComponent extends IComponent {
    state: IConstructibleState;
}

export let Constructible: IConstructibleComponent = {
    name: 'constructible',
    enum: ComponentEnum.Constructible,
    state: {
        requiredResources: {},
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