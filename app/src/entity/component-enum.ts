import * as _ from 'lodash';;

// Order doesn't matter
export enum ComponentEnum {
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

interface IComponentEnumToKeyMap {
    [key: number]: string;
}

export const componentEnumToKeyMap: IComponentEnumToKeyMap = {};

Object.keys(ComponentEnum).forEach(component => {
    const componentNumber = parseInt(component);
    // Actual enum number not string keys
    if (!isNaN(componentNumber)) {
        const componentName = ComponentEnum[componentNumber];
        componentEnumToKeyMap[componentNumber] = _.camelCase(componentName);
    }
});