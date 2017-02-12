import {
    Position,
    Renderable,
    Agent,
    Villager,
    Harvestable,
    Resource,
    Inventory,
    BehaviorTree,
    StatusBubble,
    Craftable,
    Health,
    Hunger,
    Sleep,
    Storage,
    HealthBar,
    Item,
    Building,
    Constructible,
    Corpse,
    Collision,
    Visitor,
    Name
} from './index';

import {IComponent} from '../entityManager';

// Order doesn't matter
export let componentsList: IComponent[] = [
    Position,
    Renderable,
    Agent,
    Item,
    Storage,
    Craftable,
    Villager,
    Resource,
    StatusBubble,
    Visitor,
    BehaviorTree,
    Harvestable,
    Health,
    Hunger,
    Sleep,
    HealthBar,
    Building,
    Constructible,
    Collision,
    Corpse,
    Name,
    Inventory
];