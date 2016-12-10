import {ComponentEnum} from './component-enum';

export enum AssemblagesEnum {
    Agent,
    Villager,
    Resource,
    Item,
    Building,
    Corpse,
};

export type Assemblage = ComponentEnum[];

export interface IAssemblagesMap {
    [key: number]: Assemblage;
}

const agentComponents = [
    ComponentEnum.Agent,
    ComponentEnum.Renderable,
    ComponentEnum.Position,
    ComponentEnum.StatusBubble,
    ComponentEnum.Health,
    ComponentEnum.HealthBar,
    ComponentEnum.BehaviorTree,
    ComponentEnum.Name
];

export const assemblages: IAssemblagesMap = {
    [AssemblagesEnum.Agent]: agentComponents,
    [AssemblagesEnum.Villager]: agentComponents.concat([
        ComponentEnum.Villager,
    ]),
    [AssemblagesEnum.Resource]: [
        ComponentEnum.Resource,
        ComponentEnum.Renderable,
        ComponentEnum.Position,
        ComponentEnum.Harvestable,
        ComponentEnum.Health,
        ComponentEnum.Name
    ],
    [AssemblagesEnum.Item]: [
        ComponentEnum.Renderable,
        ComponentEnum.Position,
        ComponentEnum.Item,
        ComponentEnum.Name
    ],
    [AssemblagesEnum.Corpse]: [
        ComponentEnum.Renderable,
        ComponentEnum.Position,
        ComponentEnum.Corpse
    ],
    [AssemblagesEnum.Building]: [
        ComponentEnum.Position,
        ComponentEnum.Building,
        ComponentEnum.Constructible,
        ComponentEnum.Collision,
        // ComponentEnum.Enterable,
        ComponentEnum.Health,
        ComponentEnum.HealthBar,
        ComponentEnum.Renderable,
    ]
};