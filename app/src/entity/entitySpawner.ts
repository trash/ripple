import * as _ from 'lodash';
import {
	IEntityComponentData,
	IRowColumnCoordinates,
	RequiredResources
} from '../interfaces';
import {constants} from '../data/constants';
import {AssemblagesEnum, assemblages} from '../entity/assemblages';
import {store} from '../redux/store';
import {
	addToItemList,
	spawnAgent,
	spawnBuilding,
	spawnResource
} from '../redux/actions';

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
	IConstructibleState,
	IVisitorState,
	IBuildingState,
	IResourceState,
	IHarvestableState,
	INameState
} from '../entity/components';

import {EntityManager} from '../entity/entityManager';
import {IAgentAssemblageTestData, IVillagerComponentOptions} from '../data/testLevel';
import {Building} from '../data/Building';
import {Agent} from '../data/Agent';
import {Resource} from '../data/Resource';
import {Item} from '../data/Item';
import {MapTile} from '../map/tile';
import {baseUtil, storageUtil, constructibleUtil, positionUtil} from './util';
import {util} from '../util';
import {events} from '../events';
import {globalRefs} from '../globalRefs';

export class EntitySpawner {
    entityManager: EntityManager;

    constructor (
		entityManager: EntityManager
	) {
        this.entityManager = entityManager;
		events.on('spawnAgent', (agent: Agent, turn: number, data?: IEntityComponentData) =>
			this.spawnAgent(agent, turn, data));
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
		const data = pair[0];
		const componentEnum = pair[1];
		if (data) {
			const entityState = this.entityManager.getComponentDataForEntity(
				componentEnum,
				entityId
			);
			if (entityState) {
				// Make sure we get all props even if they're not defined in the
				// default state object
				const props = _.union(Object.keys(entityState), Object.keys(data));
				props.forEach(stateProp => {
					const value = data[stateProp]
					if (value !== undefined) {
						entityState[stateProp] = value;
					}
				});
			}
		}
	}

	// Automatically copies over the necessary component data for a new entity
	private copyNeededComponentData (
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

	static agentEnumToAssemblageMap = {
		[Agent.Adventurer]: AssemblagesEnum.Adventurer,
		[Agent.Visitor]: AssemblagesEnum.Visitor,
		[Agent.Villager]: AssemblagesEnum.Villager
	}

    /**
	* Creates a agent and adds it to the list of citizens for the game manager to keep track of.
	*
	* @returns {Agent} The agent that was created.
	*/
	spawnAgent (
		agent: Agent,
		turn: number,
		entityComponentData: IEntityComponentData = {}
	): number {
		let assemblage = AssemblagesEnum.Agent;
		if (agent in EntitySpawner.agentEnumToAssemblageMap) {
			assemblage = EntitySpawner.agentEnumToAssemblageMap[agent];
		}
		const entityId = this.entityManager.createEntityFromAssemblage(assemblage);

		console.info(`Spawning: ${Agent[agent]} with entityId: ${entityId}`);

		// Get relevant state
		const positionState = this.entityManager.getComponentDataForEntity(
			Component.Position, entityId) as IPositionState;
		const agentState = this.entityManager.getComponentDataForEntity(
			Component.Agent, entityId) as IAgentState;
		const villagerState = this.entityManager.getComponentDataForEntity(
			Component.Villager, entityId) as IVillagerState;
		const visitorState = this.entityManager.getComponentDataForEntity(
			Component.Visitor, entityId) as IVisitorState;
		const renderableState = this.entityManager.getComponentDataForEntity(
			Component.Renderable, entityId) as IRenderableState;
		const healthState = this.entityManager.getComponentDataForEntity(
			Component.Health, entityId) as IHealthState;
		const nameState = this.entityManager.getComponentDataForEntity(
			Component.Name, entityId) as INameState;

		// Copy over the defaults for the agent
		const assemblageData = _.extend({}, agentsAssemblageData[agent]);
		entityComponentData = _.merge(assemblageData, entityComponentData);
		this.copyNeededComponentData(entityId, entityComponentData, assemblage);

		positionState.hasDirection = true;
		// Set tile to 0,0
		positionUtil.setTile(
			positionState,
			positionState.tile || globalRefs.map.getTile(0, 0),
			turn,
			agentState.speed
		);

		// Notify redux of new agent
		store.dispatch(spawnAgent(
			entityId,
			agentState,
			nameState,
			villagerState,
			visitorState,
			positionState,
			healthState,
			''
		));

		return entityId;
	}

	private spawnFromAssemblage(
		assemblage: AssemblagesEnum,
		entityComponentData: IEntityComponentData,
		entityId: number = null
	): number {
		entityId = entityId !== null
			? this.entityManager.createEntityFromAssemblage(assemblage, entityId)
			: this.entityManager.createEntityFromAssemblage(assemblage);

		this.copyNeededComponentData(entityId, entityComponentData, assemblage);

        return entityId;
	}

	spawnCorpse (
		entityComponentData: IEntityComponentData = {}
	): number {
		return this.spawnFromAssemblage(AssemblagesEnum.Corpse, entityComponentData);
	}

	spawnTown(
		entityComponentData: IEntityComponentData = {}
	): number {
		const entityId = this.spawnFromAssemblage(
			AssemblagesEnum.Town,
			entityComponentData,
			constants.TOWN_ID
		);
		console.info(`Spawning Town with id: ${entityId}`);
		return entityId;
	}

	spawnResource (
        resourceEnum: Resource,
        tile: IRowColumnCoordinates,
        entityComponentData: IEntityComponentData = {}
    ): number {
		const assemblageData = _.extend({}, resourcesAssemblageData[resourceEnum]);
		entityComponentData = _.merge(assemblageData, entityComponentData);
		const entityId = this.entityManager.createEntityFromAssemblage(AssemblagesEnum.Resource);
		entityComponentData.position = {
			tile: tile
		};

		this.copyNeededComponentData(entityId, entityComponentData, AssemblagesEnum.Resource);

		// Get relevant state
		const positionState = this.entityManager.getComponentDataForEntity(
			Component.Position, entityId) as IPositionState;
		const resourceState = this.entityManager.getComponentDataForEntity(
			Component.Resource, entityId) as IResourceState;
		const harvestableState = this.entityManager.getComponentDataForEntity(
			Component.Harvestable, entityId) as IHarvestableState;
		const healthState = this.entityManager.getComponentDataForEntity(
			Component.Health, entityId) as IHealthState;

		// Notify redux of new entity
		store.dispatch(spawnResource(
			entityId,
			resourceState,
			harvestableState,
			healthState,
			positionState
		));

		return entityId;
	}

	itemNamesFromList (
		list: [Item, string][]
	): Item[] {
		let items = [];
		list.forEach(([item, itemPattern]) => {
			// https://regex101.com/r/kA9pJ2/2
			// Removed the item name in front
			// Acceptable inputs: *3, *[1-3], %50, *[1-3]%50
			const matches = itemPattern.match(/\**((\d)*)(?:\[(\d+)-(\d+)\])*%*(\d+)*/);

			const itemCount = parseInt(matches[1]);
			const itemRangeStart = parseInt(matches[2]);
			const itemRangeEnd = parseInt(matches[3]);
			const itemSpawnChance = parseInt(matches[4]);

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
				items.push(item);
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

		this.copyNeededComponentData(entityId, entityComponentData, AssemblagesEnum.Item);

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
		items: [Item, string][],
		entityComponentData: IEntityComponentData = {}
	): number[] {
		return this.itemNamesFromList(items).map(item => {
			return this.spawnItem(item, entityComponentData);
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
		events.emit(['trigger-sound', 'placeBuilding']);

		const assemblageData = _.extend({}, buildingsAssemblageData[building]);
		entityComponentData = _.merge(assemblageData, entityComponentData);

		const entityId = this.entityManager.createEntityFromAssemblage(AssemblagesEnum.Building);

		console.info(`Spawning: ${Building[building]} with entityId: ${entityId}`);

		this.copyNeededComponentData(entityId, entityComponentData, AssemblagesEnum.Building);

		if (isCompleted) {
			const constructibleState = this.entityManager.getComponentDataForEntity(
				Component.Constructible, entityId) as IConstructibleState;
			constructibleState.taskCreated = true;

			const healthState = this.entityManager.getComponentDataForEntity(
				Component.Health, entityId) as IHealthState;
			healthState.currentHealth = healthState.maxHealth;

			const renderableState = this.entityManager.getComponentDataForEntity(
				Component.Renderable, entityId) as IRenderableState;
			const positionState = this.entityManager.getComponentDataForEntity(
				Component.Position, entityId) as IPositionState;
			constructibleUtil.initializeResourceRequirements(
				constructibleState,
				renderableState,
				positionState,
				true
			);
		}

		if (storage) {
			storage.forEach(itemEntry => {
				for (let i = 0; i < itemEntry.count; i++) {
					const itemId = this.spawnItem(itemEntry.enum, {
						item: {
							claimed: true,
							forSale: true
						}
					});
					setTimeout(() => storageUtil.storeItem(itemId, entityId), 200);
				}
			});
		}

		// Get relevant state
		const positionState = this.entityManager.getComponentDataForEntity(
			Component.Position, entityId) as IPositionState;
		const buildingState = this.entityManager.getComponentDataForEntity(
			Component.Building, entityId) as IBuildingState;
		const constructibleState = this.entityManager.getComponentDataForEntity(
			Component.Constructible, entityId) as IConstructibleState;
		const healthState = this.entityManager.getComponentDataForEntity(
			Component.Health, entityId) as IHealthState;

		// Notify redux of new entity
		store.dispatch(spawnBuilding(
			entityId,
			buildingState,
			constructibleState,
			healthState,
			positionState
		));

		return entityId;
	}
}