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
    Health,
    Hunger,
    Sleep,
    HealthBar,
    Item,
    Building,
    Constructible,
    Corpse,
    Collision,
    Name
} from './index';

import {IComponent} from '../entity-manager';

// Order doesn't matter
export let componentsList: IComponent[] = [
    Position,
    Renderable,
    Agent,
    Item,
    Villager,
    Resource,
    StatusBubble,
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