import {Component} from './ComponentEnum';

export enum AssemblagesEnum {
    Agent = 1,
    Villager,
    Resource,
    Item,
    Building,
    Corpse,
    Visitor,
    Town,
    Adventurer,
    Merchant
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
    Component.Inventory,
    Component.Collision
];

const visitorComponents = agentComponents.concat([
    Component.Visitor
]);

export const assemblages: IAssemblagesMap = {
    [AssemblagesEnum.Town]: [
        Component.Town
    ],
    [AssemblagesEnum.Agent]: agentComponents,
    [AssemblagesEnum.Villager]: agentComponents.concat([
        Component.Villager,
        Component.Hunger,
        Component.Sleep,
        Component.EquipsArmor
    ]),
    [AssemblagesEnum.Merchant]: visitorComponents,
    [AssemblagesEnum.Visitor]: visitorComponents,
    [AssemblagesEnum.Adventurer]: visitorComponents,
    [AssemblagesEnum.Resource]: [
        Component.Resource,
        Component.Collision,
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
        Component.Collision,
        Component.Name,
        Component.Armor
    ],
    [AssemblagesEnum.Corpse]: [
        Component.Renderable,
        Component.Collision,
        Component.Position,
        Component.Corpse
    ],
    [AssemblagesEnum.Building]: [
        Component.Position,
        Component.Renderable,
        Component.Building,
        Component.Storage,
        Component.Shop,
        Component.Constructible,
        Component.Collision,
        // ComponentsEnum.Enterable,
        Component.Health,
        Component.HealthBar,
        Component.Name
    ]
};