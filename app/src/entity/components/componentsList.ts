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
    Shop,
    HealthBar,
    Item,
    Building,
    Constructible,
    Corpse,
    EquipsArmor,
    Collision,
    Visitor,
    Name,
    Town
} from './index';

import {IComponent} from '../entityManager';

// Order doesn't matter
export let componentsList: IComponent<any>[] = [
    Position,
    Renderable,
    Agent,
    Item,
    Storage,
    Shop,
    Craftable,
    Villager,
    Resource,
    StatusBubble,
    Visitor,
    BehaviorTree,
    Harvestable,
    Health,
    Hunger,
    EquipsArmor,
    Sleep,
    HealthBar,
    Building,
    Constructible,
    Collision,
    Corpse,
    Name,
    Inventory,
    Town
];