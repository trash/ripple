import {
    RenderableSystem,
    PositionSystem,
    VillagerSystem,
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
} from './index';

import {EntitySystem, EntityManager} from '../entityManager';
import {Components} from '../ComponentsEnum';

// Ordered list that determines in what order systems are called (first called first)
export const systemsList:
    [new (manager: EntityManager, ComponentsEnum: Components) => EntitySystem, Components][]
= [
    [HarvestSelectSystem, Components.Resource],
    [VillagerSystem, Components.Villager],
    [BehaviorTreeSystem, Components.Agent],
    [PositionSystem, Components.Position],
    [ResourceSystem, Components.Resource],
    [BuildingSystem, Components.Building],
    [ConstructibleSystem, Components.Constructible],
    [CollisionSystem, Components.Collision],
    [ItemSystem, Components.Item],
    [AgentSystem, Components.Agent],
    [CorpseSystem, Components.Corpse],
    [HarvestableSystem, Components.Harvestable],
    [HungerSystem, Components.Hunger],
    [SleepSystem, Components.Sleep],
    [StatusBubbleSystem, Components.StatusBubble],
    [HealthBarSystem, Components.HealthBar],
    [RenderableSystem, Components.Renderable],
];