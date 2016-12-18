import {Position} from './position';
import {Renderable} from './renderable';
import {Agent} from './agent';
import {Villager} from './villager';
import {Harvestable} from './harvestable';
import {Resource} from './resource';
import {Inventory} from './Inventory';
import {BehaviorTree} from './behavior-tree';
import {StatusBubble} from './status-bubble';
import {Health} from './health';
import {HealthBar} from './health-bar';
import {Item} from './item';
import {Building} from './building';
import {Constructible} from './constructible';
import {Corpse} from './corpse';
import {Collision} from './collision';
import {Name} from './name';

import {IComponent} from '../entity-manager';

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
    HealthBar,
    Building,
    Constructible,
    Collision,
    Corpse,
    Name,
    Inventory
];