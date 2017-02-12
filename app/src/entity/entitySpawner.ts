import * as _ from 'lodash';
import {
	IEntityComponentData,
	IRowColumnCoordinates,
	RequiredResources
} from '../interfaces';
import {AssemblagesEnum, assemblages} from '../entity/assemblages';
import {store} from '../redux/store';
import {addToItemList} from '../redux/Actions';

import {
	agents as agentsAssemblageData,
	resources as resourcesAssemblageData,
	items as itemsAssemblageData,
	buildings as buildingsAssemblageData
} from '../entity/assemblageData';

import {Component, ComponentsEnumToKeyMap} from '../entity/ComponentEnum';

import {
	IPositionState,
	IItemState,
	IRenderableState,
	IAgentState,
	IHealthState,
	IVillagerState,
	IBehaviorTreeState,
	IConstructibleState
} from '../entity/components';

import {EntityManager} from '../entity/entityManager';
import {IAgentAssemblageTestData, IVillagerComponentOptions} from '../data/testLevel';
import {Building} from '../data/Building';
import {Agent} from '../data/Agent';
import {Item} from '../data/Item';
import {GameMap} from '../map';
import {MapTile} from '../map/tile';
import {baseUtil, storageUtil} from './util';
import {util} from '../util';
import {events} from '../events';

const globalRefs: {
	map: GameMap
} = {
	map: null
};
events.on('map-update', (map: GameMap) => {
	globalRefs.map = map;
});

export class EntitySpawner {
    entityManager: EntityManager;

    constructor (
		entityManager: EntityManager
	) {
        this.entityManager = entityManager;
		events.on('spawnAgent', (agent: Agent) => this.spawnAgent(agent));
		events.on('spawnItem', (item: Item) => this.spawnItem(item, {
			item: {
				claimed: true
			}
		}));
    }

    copyComponentData (
		entityId: number,
		pair: [any, Component]
	) {
		if (pair[0]) {
			const entityState = this.entityManager.getComponentDataForEntity(
				pair[1], entityId);
			if (entityState) {
				for (const stateProp in entityState) {
					const value = pair[0][stateProp]
					if (value !== undefined) {
						entityState[stateProp] = value;
					}
				}
			}
		}
	}

	// Automatically copies over the necessary component data for a new entity
	_copyNeededComponentData (
		entityId: number,
		entityComponentData: IEntityComponentData,
		assemblageEnum: AssemblagesEnum
	) {
		const assemblageComponentList = assemblages[assemblageEnum];
		const assemblageComponentPairList = [];

		assemblageComponentList.forEach(ComponentsEnum => {
			const dataKey = ComponentsEnumToKeyMap[ComponentsEnum];
			assemblageComponentPairList.push([entityComponentData[dataKey], ComponentsEnum]);
		});
		assemblageComponentPairList.forEach(pair => {
			this.copyComponentData(entityId, pair);
		});
	}

    /**
	* Creates a agent and adds it to the list of citizens for the game manager to keep track of.
	*
	* @returns {Agent} The agent that was created.
	*/
	spawnAgent (
		agent: Agent,
		villager: IVillagerComponentOptions = null,
		entityComponentData: IEntityComponentData = {}
	): number {
		const assemblage = villager ?
			AssemblagesEnum.Villager :
			AssemblagesEnum.Agent;
		const entityId = this.entityManager.createEntityFromAssemblage(assemblage);

		console.info(`Spawning: ${Agent[agent]} with entityId: ${entityId}`);

		// Get relevant state
		const positionState = this.entityManager.getComponentDataForEntity(
			Component.Position, entityId) as IPositionState;
		const agentState = this.entityManager.getComponentDataForEntity(
			Component.Agent, entityId) as IAgentState;
		const villagerState = this.entityManager.getComponentDataForEntity(
			Component.Villager, entityId) as IVillagerState;
		const renderableState = this.entityManager.getComponentDataForEntity(
			Component.Renderable, entityId) as IRenderableState;

		// Copy over the defaults for the agent
		const assemblageData = _.extend({}, agentsAssemblageData[agent]);
		entityComponentData = _.merge(assemblageData, entityComponentData);
		this._copyNeededComponentData(entityId, entityComponentData, assemblage);

		// If they specified options for the villager, assign them
		if (villager) {
			villagerState.job = villager.job !== undefined
				? villager.job
				: villagerState.job;
		}
		positionState.hasDirection = true;
		// Set tile to 0,0
		positionState.tile = globalRefs.map.getTile(0, 0);

		return entityId;
	}

	spawnCorpse (entityComponentData: IEntityComponentData): number {
		const entityId = this.entityManager.createEntityFromAssemblage(AssemblagesEnum.Corpse);

		this._copyNeededComponentData(entityId, entityComponentData, AssemblagesEnum.Corpse);

        return entityId;
	}

	spawnResource (
        resourceName: string,
        tile: IRowColumnCoordinates,
        entityComponentData: IEntityComponentData = {}
    ): number {
		const assemblageData = _.extend({}, resourcesAssemblageData[resourceName]);
		entityComponentData = _.merge(assemblageData, entityComponentData);
		const entityId = this.entityManager.createEntityFromAssemblage(AssemblagesEnum.Resource);
		entityComponentData.position = {
			tile: tile
		};

		this._copyNeededComponentData(entityId, entityComponentData, AssemblagesEnum.Resource);

		return entityId;
	}

	itemNamesFromList (
		list: string[]
	): string[] {
		let items = [];
		list.forEach(itemPattern => {
			// https://regex101.com/r/kA9pJ2/2
			// Acceptable inputs: wood*3, wood*[1-3], wood%50, wood*[1-3]%50
			const matches = itemPattern.match(/(\w+-*\w*)\**((\d)*)(?:\[(\d+)-(\d+)\])*%*(\d+)*/);

			const itemName = matches[1];
			const itemCount = parseInt(matches[2]);
			const itemRangeStart = parseInt(matches[3]);
			const itemRangeEnd = parseInt(matches[4]);
			const itemSpawnChance = parseInt(matches[5]);

			let count = 1;

			if (itemCount) {
				count = itemCount;
			} else if (itemRangeStart) {
				count = util.randomInRange(itemRangeStart, itemRangeEnd);
			}

			// Only spawn *any* items if spawn chance succeeds
			if (itemSpawnChance) {
				if (Math.random() > (itemSpawnChance / 100)) {
					return;
				}
			}

			for (let i = 0; i < count; i++) {
				items.push(itemName);
			}
		});
		return items;
	}

	spawnItem (
		item: Item,
        entityComponentData: IEntityComponentData = {}
    ): number {
		const assemblageData = _.extend({}, itemsAssemblageData[item]);
		entityComponentData = _.merge(assemblageData, entityComponentData);

		const entityId = this.entityManager.createEntityFromAssemblage(AssemblagesEnum.Item);

		// Get the tile to spawn *before* creating the item or the item itself will
		// show up in the search
		const tileDoesntContainItem = (tile: MapTile): boolean => {
			return !baseUtil.tileContainsEntityOfComponent(Component.Item, tile);
		};
		const spawnTileStart = (entityComponentData.position
			&& entityComponentData.position.tile)
			|| globalRefs.map.getTile(0, 0);
		const spawnTile = globalRefs.map.getNearestEmptyTile(
			spawnTileStart,
			tileDoesntContainItem
		);

		this._copyNeededComponentData(entityId, entityComponentData, AssemblagesEnum.Item);

		const positionState = this.entityManager.getComponentDataForEntity(
			Component.Position, entityId) as IPositionState;
		const itemState = this.entityManager.getComponentDataForEntity(
			Component.Item, entityId) as IItemState;

		positionState.tile = spawnTile;
		itemState.shouldBeSpawned = true;

        store.dispatch(addToItemList(item));

		return entityId;
	}

	spawnItemsFromList (
		items: string[],
		entityComponentData: IEntityComponentData = {}
	): number[] {
		return this.itemNamesFromList(items).map(itemName => {
			return this.spawnItem(Item[itemName], entityComponentData);
		});
	}

	/**
	 * Creates a building in an already completed state
	 *
	 * @param  {Object} options The options containing what building to build and where
	 */
	spawnBuilding (
        building: Building,
		isCompleted: boolean = false,
		storage: RequiredResources,
        entityComponentData: IEntityComponentData = {}
    ): number {
		if (!entityComponentData.position.tile) {
			console.error('Spawning a building without a tile.');
		}
		const assemblageData = _.extend({}, buildingsAssemblageData[building]);
		entityComponentData = _.merge(assemblageData, entityComponentData);

		const entityId = this.entityManager.createEntityFromAssemblage(AssemblagesEnum.Building);

		console.info(`Spawning: ${building} with entityId: ${entityId}`);

		this._copyNeededComponentData(entityId, entityComponentData, AssemblagesEnum.Building);

		if (isCompleted) {
			const constructibleState = this.entityManager.getComponentDataForEntity(
				Component.Constructible, entityId) as IConstructibleState;
			constructibleState.taskCreated = true;
			const healthState = this.entityManager.getComponentDataForEntity(
				Component.Health, entityId) as IHealthState;
			healthState.currentHealth = healthState.maxHealth;
		}

		if (storage) {
			storage.forEach(itemEntry => {
				for (let i = 0; i < itemEntry.count; i++) {
					const itemId = this.spawnItem(itemEntry.enum);
					setTimeout(() => storageUtil.storeItem(itemId, entityId), 200);
				}
			});
		}

		return entityId;
	}
}