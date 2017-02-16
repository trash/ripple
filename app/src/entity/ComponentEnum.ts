import * as _ from 'lodash';

// Order doesn't matter
export enum Component {
    Position,
    Renderable,
    Storage,
    Agent,
    Villager,
    Visitor,
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
    Inventory
}

interface IComponentsEnumToKeyMap {
    [key: number]: string;
}

export const ComponentsEnumToKeyMap: IComponentsEnumToKeyMap = {};

Object.keys(Component).forEach(component => {
    const componentNumber = parseInt(component);
    // Actual enum number not string keys
    if (!isNaN(componentNumber)) {
        const componentName = Component[componentNumber];
        ComponentsEnumToKeyMap[componentNumber] = _.camelCase(componentName);
    }
});