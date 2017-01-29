import {Components} from './ComponentsEnum';

export enum AssemblagesEnum {
    Agent,
    Villager,
    Resource,
    Item,
    Building,
    Corpse,
};

export type Assemblage = Components[];

export interface IAssemblagesMap {
    [key: number]: Assemblage;
}

const agentComponents = [
    Components.Agent,
    Components.Renderable,
    Components.Position,
    Components.StatusBubble,
    Components.Health,
    Components.HealthBar,
    Components.BehaviorTree,
    Components.Name,
    Components.Inventory
];

export const assemblages: IAssemblagesMap = {
    [AssemblagesEnum.Agent]: agentComponents,
    [AssemblagesEnum.Villager]: agentComponents.concat([
        Components.Villager,
        Components.Hunger,
        Components.Sleep,
    ]),
    [AssemblagesEnum.Resource]: [
        Components.Resource,
        Components.Renderable,
        Components.Position,
        Components.Harvestable,
        Components.Health,
        Components.Name
    ],
    [AssemblagesEnum.Item]: [
        Components.Renderable,
        Components.Position,
        Components.Item,
        Components.Name
    ],
    [AssemblagesEnum.Corpse]: [
        Components.Renderable,
        Components.Position,
        Components.Corpse
    ],
    [AssemblagesEnum.Building]: [
        Components.Position,
        Components.Renderable,
        Components.Building,
        Components.Constructible,
        Components.Collision,
        // ComponentsEnum.Enterable,
        Components.Health,
        Components.HealthBar,
        Components.Name
    ]
};