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
import {ComponentEnum} from '../componentEnum';

// Ordered list that determines in what order systems are called (first called first)
export const systemsList:
    [new (manager: EntityManager, componentEnum: ComponentEnum) => EntitySystem, ComponentEnum][]
= [
    [HarvestSelectSystem, ComponentEnum.Resource],
    [VillagerSystem, ComponentEnum.Villager],
    [BehaviorTreeSystem, ComponentEnum.Agent],
    [PositionSystem, ComponentEnum.Position],
    [ResourceSystem, ComponentEnum.Resource],
    [BuildingSystem, ComponentEnum.Building],
    [ConstructibleSystem, ComponentEnum.Constructible],
    [CollisionSystem, ComponentEnum.Collision],
    [ItemSystem, ComponentEnum.Item],
    [AgentSystem, ComponentEnum.Agent],
    [CorpseSystem, ComponentEnum.Corpse],
    [HarvestableSystem, ComponentEnum.Harvestable],
    [HungerSystem, ComponentEnum.Hunger],
    [SleepSystem, ComponentEnum.Sleep],
    [StatusBubbleSystem, ComponentEnum.StatusBubble],
    [HealthBarSystem, ComponentEnum.HealthBar],
    [RenderableSystem, ComponentEnum.Renderable],
];