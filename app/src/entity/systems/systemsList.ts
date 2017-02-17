import {
    RenderableSystem,
    PositionSystem,
    VillagerSystem,
    InventorySystem,
    AgentSystem,
    ResourceSystem,
    ItemSystem,
    BuildingSystem,
    ConstructibleSystem,
    HarvestableSystem,
    HealthBarSystem,
    HungerSystem,
    SleepSystem,
    BehaviorTreeSystem,
    StatusBubbleSystem,
    HarvestSelectSystem,
    CollisionSystem,
    CorpseSystem,
    GuardSystem,
    VisitorSystem,
    StorageSystem
} from './index';

import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';

// Ordered list that determines in what order systems are called (first called first)
export const systemsList:
    [new (manager: EntityManager, ComponentsEnum: Component) => EntitySystem, Component][]
= [
    [HarvestSelectSystem, Component.Resource],
    [VillagerSystem, Component.Villager],
    [VisitorSystem, Component.Visitor],
    [BehaviorTreeSystem, Component.Agent],
    [PositionSystem, Component.Position],
    [ResourceSystem, Component.Resource],
    [BuildingSystem, Component.Building],
    [ConstructibleSystem, Component.Constructible],
    [CollisionSystem, Component.Collision],
    [ItemSystem, Component.Item],
    [InventorySystem, Component.Inventory],
    [StorageSystem, Component.Storage],
    [AgentSystem, Component.Agent],
    [GuardSystem, Component.Agent],
    [CorpseSystem, Component.Corpse],
    [HarvestableSystem, Component.Harvestable],
    [HungerSystem, Component.Hunger],
    [SleepSystem, Component.Sleep],
    [StatusBubbleSystem, Component.StatusBubble],
    [HealthBarSystem, Component.HealthBar],
    [RenderableSystem, Component.Renderable],
];