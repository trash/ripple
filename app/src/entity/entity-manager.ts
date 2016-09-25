import _ = require('lodash');
import {uniqueId} from '../unique-id';
import {ComponentEnum} from './component-enum';
import {componentsList} from './components/components-list';
import {Assemblage, assemblages, AssemblagesEnum} from './assemblages';
import {systemsList as sysList} from './systems/systems-list';
import {EventEmitter2} from 'eventemitter2';
import {BaseUtil} from './util/base';
import {agentUtil} from './util/agent';
import {itemUtil} from './util/item';
import {statusBubbleUtil} from './util/status-bubble';

export class EntitySystem extends EventEmitter2 {
    manager: EntityManager;
    componentEnum: ComponentEnum;

    constructor (manager: EntityManager, componentEnum: ComponentEnum) {
        super();
        this.manager = manager;
        this.componentEnum = componentEnum;
    }
    destroyComponent (id: number) {}
    update (entities: number[], turn?: number, stopped?: boolean) {};
}

export interface IComponent {
    enum: ComponentEnum;
    name: string;
    state: {[key: string]: any;}
}

const utilList: BaseUtil[] = [
    agentUtil,
    itemUtil,
    statusBubbleUtil
];

type EntityComponentDataMapEntry = any;
// A map of entities to their component data entries
interface IEntityComponentDataMap {
    [key: number]: EntityComponentDataMapEntry;
}
// A map of component names to a map of entity ids to their individual component data entries
interface IEntityManagerMap {
    [key: number]: IEntityComponentDataMap;
}
interface IComponentMap {
    [key: number]: IComponent;
}
interface IRemovedEntitiesMap {
    [key: number]: boolean;
}

export class EntityManager {
    entities: number[];
    components: IComponentMap;
    systems: EntitySystem[];
    entityComponentDataMap: IEntityManagerMap;
    removedEntities: IRemovedEntitiesMap;

    constructor () {
        // Lazy load this for circular dependency reasons
        let systemsList: typeof sysList = require('./systems/systems-list').systemsList;

        this.entities = [];
        this.components = {};
        this.systems = [];
        this.entityComponentDataMap = {} as IEntityManagerMap;
        this.removedEntities = {};

        componentsList.forEach(component => {
            this.addComponent(component);
        });
        systemsList.forEach(SystemComponentPair => {
            const System = SystemComponentPair[0],
                componentEnum = SystemComponentPair[1];
            this.addSystem(new System(this, componentEnum));
        });
        utilList.forEach(util => {
            util.intialize(this);
        });
    }

    destroy () {
        console.error('implement later');
    }

    update (turn: number, stopped: boolean) {
        this.systems.forEach((system) => {
            const entityIds = this.getEntityIdsForComponent(system.componentEnum);
            system.update(entityIds, turn, stopped);
        });
    }

    createEntity (componentNames: ComponentEnum[]): number {
        const entityId = parseInt(uniqueId.get());

        componentNames.forEach(componentName => {
            this.addComponentToEntity(entityId, componentName);
        });
        this.entities.push(entityId);

        return entityId;
    }

    createEntityFromAssemblage (assemblageEnum: AssemblagesEnum): number {
        return this.createEntity(assemblages[assemblageEnum]);
    }

    _getSystemForComponent (component: ComponentEnum): EntitySystem {
        return this.systems.find(system => system.componentEnum === component);
    }

    removeComponentDataEntry (entityId: number, componentName: ComponentEnum) {
        const componentEntry = this.entityComponentDataMap[componentName];
        if (entityId in componentEntry) {
            const system = this._getSystemForComponent(componentName);
            if (system) {
                system.destroyComponent(entityId);
            }

            delete componentEntry[entityId];
        }
    }

    removeEntity (entityId: number) {
        // Remove each component data entry
        for (const componentName in this.entityComponentDataMap) {
            this.removeComponentDataEntry(entityId, parseInt(componentName));
        }
        const index = this.entities.indexOf(entityId);
        this.entities.splice(index, 1);
        // Keep this for cache invalidation
        this.removedEntities[entityId] = true;
    }

    createNewComponentDataMapEntry (componentName: ComponentEnum) {
        return _.extend({}, this.components[componentName].state);
    }

    addComponentToEntity (entityId: number, componentName: ComponentEnum) {
        // console.log(`Adding component: ${this.components[componentName].name} to entity with id: ${entityId}`);
        const componentDataMapEntry = this.getComponentDataForEntity(componentName, entityId);
        if (componentDataMapEntry) {
            console.error(`Instance of component already exists for this entity. Component: ${componentName}, entity: ${entityId}`);
            return;
        }
        this.getEntitiesWithComponent(componentName)[entityId] = this.createNewComponentDataMapEntry(componentName);
    }

    addComponent (component: IComponent) {
        this.components[component.enum] = component;
        this.entityComponentDataMap[component.enum] = {};
    }

    addSystem (system: EntitySystem) {
        this.systems.push(system);
    }

    getEntitiesWithComponent (componentName: ComponentEnum): IEntityComponentDataMap {
        const entities = this.entityComponentDataMap[componentName];
        // This means you prolly forgot to add the component to the componentlist
        if (!entities) {
            console.error(`getEntitiesWithComponent failed componentName: ${componentName}`);
            debugger;
        }
        return entities;
    }

    getComponentDataForEntity (componentName: ComponentEnum, entityId: number) {
        return this.getEntitiesWithComponent(componentName)[entityId];
    }

    // Useful for debugging entities
    _getAllComponentsForEntity (entityId: number) {
        const data = {};
        Object.keys(ComponentEnum).forEach(component => {
            const componentNumber = parseInt(component);
            if (!isNaN(componentNumber)) {
                data[component] = this.getComponentDataForEntity(componentNumber, entityId);
            }
        });
        return data;
    }

    getEntityIdsForComponent (componentName: ComponentEnum): number[] {
        return Object.keys(this.getEntitiesWithComponent(componentName)).map(key => parseInt(key));
    }
}