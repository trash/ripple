import * as _ from 'lodash';;
import {uniqueId} from '../unique-id';
import {Component} from './ComponentEnum';
import {componentsList} from './components/ComponentsList';
import {Assemblage, assemblages, AssemblagesEnum} from './assemblages';
import {systemsList as sysList} from './systems';
import {EventEmitter2} from 'eventemitter2';
import {EntitySpawner} from './entitySpawner';

// Utils
import {
    BaseUtil,
    baseUtil,
    agentUtil,
    collisionUtil,
    itemUtil,
    mapUtil,
    harvestableUtil,
    positionUtil,
    buildingUtil,
    statusBubbleUtil,
    visitorUtil,
    storageUtil
} from './util';

export class EntitySystem extends EventEmitter2 {
    manager: EntityManager;
    componentType: Component;
    updateInterval?: number;

    constructor (
        manager: EntityManager,
        component: Component
    ) {
        super();
        this.componentType = component;
        this.manager = manager;
    }
    createComponent (id: number) {}
    destroyComponent (id: number) {}
    update (entities: number[], turn?: number, stopped?: boolean) {};
}

export interface IComponent {
    enum: Component;
    blacklistedDebugProperties?: string[];
    name: string;
    state: {[key: string]: any;}
}

const utilList: BaseUtil[] = [
    baseUtil,
    agentUtil,
    harvestableUtil,
    itemUtil,
    mapUtil,
    positionUtil,
    statusBubbleUtil,
    collisionUtil,
    buildingUtil,
    storageUtil,
    visitorUtil,
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
interface IEntityComponentToIdListMap {
    [key: number]: number[];
}

export class EntityManager {
    entities: number[];
    components: IComponentMap;
    systems: EntitySystem[];
    entityComponentDataMap: IEntityManagerMap;
    removedEntities: IRemovedEntitiesMap;
    entityComponentToIdListMap: IEntityComponentToIdListMap;
    spawner: EntitySpawner;

    constructor () {
        this.spawner = new EntitySpawner(this);

        // Lazy load this for circular dependency reasons
        let systemsList: typeof sysList = require('./systems/systemsList').systemsList;

        this.entities = [];
        this.components = {};
        this.systems = [];
        this.entityComponentDataMap = {};
        this.removedEntities = {};
        this.entityComponentToIdListMap = {};

        componentsList.forEach(component => {
            this.addComponent(component);
        });
        systemsList.forEach(SystemComponentPair => {
            const System = SystemComponentPair[0],
                ComponentsEnum = SystemComponentPair[1];
            this.addSystem(new System(this, ComponentsEnum));
        });
        utilList.forEach(util => {
            util.intialize(this);
        });
    }

    destroy () {
        console.error('implement later');
    }

    update (
        turn: number,
        stopped: boolean
    ) {
        this.systems.forEach(system => {
            if (system.updateInterval && turn % system.updateInterval !== 1) {
                return;
            }
            const entityIds = this.getEntityIdsForComponent(system.componentType);
            system.update(entityIds, turn, stopped);
        });
    }

    createEntity (componentNames: Component[]): number {
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

    _getSystemForComponent (component: Component): EntitySystem {
        return this.systems.find(system => system.componentType === component);
    }

    removeComponentDataEntry (entityId: number, componentName: Component) {
        const componentEntry = this.entityComponentDataMap[componentName];
        if (entityId in componentEntry) {
            const system = this._getSystemForComponent(componentName);
            if (system) {
                system.destroyComponent(entityId);
            }

            delete componentEntry[entityId];
            // Remove the id
            // NOTE: This is probably very expensive. We might want to just null out
            // removed entities and handle nulls in the id list
            const idList = this.entityComponentToIdListMap[componentName];
            idList.splice(idList.indexOf(entityId), 1);
        }
    }

    destroyEntity (entityId: number) {
        // Remove each component data entry
        for (const componentName in this.entityComponentDataMap) {
            this.removeComponentDataEntry(entityId, parseInt(componentName));
        }
        const index = this.entities.indexOf(entityId);
        this.entities.splice(index, 1);
        // Keep this for cache invalidation
        this.removedEntities[entityId] = true;
    }

    createNewComponentDataMapEntry (componentName: Component) {
        return _.extend({}, this.components[componentName].state);
    }

    addComponentToEntity (
        entityId: number,
        componentName: Component
    ) {
        // console.log(`Adding component: ${this.components[componentName].name} to entity with id: ${entityId}`);
        const componentDataMapEntry = this.getComponentDataForEntity(componentName, entityId);
        if (componentDataMapEntry) {
            console.error(`Instance of component already exists for this entity. Component: ${componentName}, entity: ${entityId}`);
            return;
        }
        this.getEntitiesWithComponent(componentName)[entityId] = this.createNewComponentDataMapEntry(componentName);
        this.entityComponentToIdListMap[componentName].push(entityId);
        // Let system handle creation
        const system = this._getSystemForComponent(componentName);
        if (system) {
            system.createComponent(entityId);
        }
    }

    addComponent (component: IComponent) {
        this.components[component.enum] = component;
        this.entityComponentDataMap[component.enum] = {};
        this.entityComponentToIdListMap[component.enum] = [];
    }

    addSystem (system: EntitySystem) {
        this.systems.push(system);
    }

    getEntitiesWithComponent (componentName: Component): IEntityComponentDataMap {
        const entities = this.entityComponentDataMap[componentName];
        // This means you prolly forgot to add the component to the componentlist
        if (!entities) {
            console.error(`getEntitiesWithComponent failed componentName: ${componentName}`);
        }
        return entities;
    }

    getComponentDataForEntity (componentName: Component, entityId: number) {
        return this.getEntitiesWithComponent(componentName)[entityId];
    }

    // Useful for debugging entities
    _getAllComponentsForEntity (entityId: number) {
        const data = {};
        Object.keys(Component).forEach(component => {
            const componentNumber = parseInt(component);
            if (!isNaN(componentNumber)) {
                data[component] = this.getComponentDataForEntity(componentNumber, entityId);
            }
        });
        return data;
    }

    getEntityIdsForComponent (componentName: Component): number[] {
        return this.entityComponentToIdListMap[componentName];
    }
}