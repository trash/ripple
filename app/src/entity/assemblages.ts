import {Component} from './ComponentEnum';

export enum AssemblagesEnum {
    Agent,
    Villager,
    Resource,
    Item,
    Building,
    Corpse,
    Visitor,
};

export type Assemblage = Component[];

export interface IAssemblagesMap {
    [key: number]: Assemblage;
}

const agentComponents = [
    Component.Agent,
    Component.Renderable,
    Component.Position,
    Component.StatusBubble,
    Component.Health,
    Component.HealthBar,
    Component.BehaviorTree,
    Component.Name,
    Component.Inventory
];

export const assemblages: IAssemblagesMap = {
    [AssemblagesEnum.Agent]: agentComponents,
    [AssemblagesEnum.Villager]: agentComponents.concat([
        Component.Villager,
        Component.Hunger,
        Component.Sleep,
    ]),
    [AssemblagesEnum.Visitor]: agentComponents.concat([
        Component.Visitor
    ]),
    [AssemblagesEnum.Resource]: [
        Component.Resource,
        Component.Renderable,
        Component.Position,
        Component.Harvestable,
        Component.Health,
        Component.Name
    ],
    [AssemblagesEnum.Item]: [
        Component.Renderable,
        Component.Position,
        Component.Item,
        Component.Name
    ],
    [AssemblagesEnum.Corpse]: [
        Component.Renderable,
        Component.Position,
        Component.Corpse
    ],
    [AssemblagesEnum.Building]: [
        Component.Position,
        Component.Renderable,
        Component.Building,
        Component.Storage,
        Component.Constructible,
        Component.Collision,
        // ComponentsEnum.Enterable,
        Component.Health,
        Component.HealthBar,
        Component.Name
    ]
};