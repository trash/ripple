import {RenderableSystem} from './renderable';
import {PositionSystem} from './position';
import {VillagerSystem} from './villager';
import {AgentSystem} from './agent';
import {ResourceSystem} from './resource';
import {ItemSystem} from './item';
import {BuildingSystem} from './building';
import {ConstructibleSystem} from './constructible';
import {HarvestableSystem} from './harvestable';
import {HealthBarSystem} from './health-bar';
import {BehaviorTreeSystem} from './behavior-tree';
import {StatusBubbleSystem} from './status-bubble';
import {HarvestSelectSystem} from './harvest-select';
import {CollisionSystem} from './collision';
import {CorpseSystem} from './corpse';
import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';

export let systemsList:
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
    [StatusBubbleSystem, ComponentEnum.StatusBubble],
    [HealthBarSystem, ComponentEnum.HealthBar],
    [RenderableSystem, ComponentEnum.Renderable],
];