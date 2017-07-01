import * as _ from 'lodash';

// Order doesn't matter
export enum Component {
    Position,
    Renderable,
    Storage,
    Agent,
    Villager,
    Visitor,
    Armor,
    Craftable,
    StatusBubble,
    BehaviorTree,
    Harvestable,
    Resource,
    Health,
    HealthBar,
    Item,
    Corpse,
    Building,
    Collision,
    Constructible,
    Name,
    Hunger,
    Sleep,
    Shop,
    EquipsArmor,
    Inventory,
    Town
}

interface IComponentsEnumToKeyMap {
    [key: number]: string;
}

export const ComponentsEnumToKeyMap: IComponentsEnumToKeyMap = {};

Object.keys(Component).forEach(component => {
    // Actual enum number not string keys
    if (!_.isNumber(component)) {
        const componentName = Component[component];
        ComponentsEnumToKeyMap[component] = _.camelCase(componentName);
    }
});