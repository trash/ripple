import * as _ from 'lodash';;

// Order doesn't matter
export enum Components {
    Position,
    Renderable,
    Agent,
    Villager,
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

Object.keys(Components).forEach(component => {
    const componentNumber = parseInt(component);
    // Actual enum number not string keys
    if (!isNaN(componentNumber)) {
        const componentName = Components[componentNumber];
        ComponentsEnumToKeyMap[componentNumber] = _.camelCase(componentName);
    }
});