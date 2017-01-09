// import {behaviorTree as villagerTree} from '../agents/villager-tree';
import {IEntityComponentData, IRowColumnCoordinates} from '../interfaces';
import {AssemblagesEnum, assemblages} from '../entity/assemblages';
import {agentsAssemblageData} from '../entity/assemblages-data/agents';
import {resourcesAssemblageData} from '../entity/assemblages-data/resources';
import {itemsAssemblageData} from '../entity/assemblages-data/items';
import {assemblageData as buildingsAssemblageData} from '../entity/assemblages-data/buildings';
import {ComponentEnum, componentEnumToKeyMap} from '../entity/component-enum';
import {IPositionState} from '../entity/components/position';
import {IItemState} from '../entity/components/item';
import {IRenderableState} from '../entity/components/renderable';
import {IAgentState} from '../entity/components/agent';
import {IHealthState} from '../entity/components/health';
import {IVillagerState} from '../entity/components/villager';
import {IBehaviorTreeState} from '../entity/components/behavior-tree';
import {EntityManager} from '../entity/entity-manager';
import {IAgentAssemblageTestData} from '../data/test-level';
// import {buildings} from '../services/buildings';
// import {AgentsService} from '../services/agents-service';
// import {ItemManager} from '../services/item-manager';
import {GameMap} from '../map';
import {MapTile} from '../map/tile';
import {baseUtil} from '../entity/util/base';
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
    // itemManager: ItemManager;

    constructor (
		entityManager: EntityManager
	) {
        this.entityManager = entityManager;
        // this.itemManager = itemManager;
    }

    copyComponentData (
		entityId: number,
		pair: [any, ComponentEnum]
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
		const assemblageComponentList = assemblages[assemblageEnum],
			assemblageComponentPairList = [];

		assemblageComponentList.forEach((componentEnum: ComponentEnum) => {
			const dataKey = componentEnumToKeyMap[componentEnum];
			assemblageComponentPairList.push([entityComponentData[dataKey], componentEnum]);
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
		data: IAgentAssemblageTestData,
		entityComponentData: IEntityComponentData = {}
	): number {
		const agentName = data.name;

		const entityId = this.entityManager.createEntityFromAssemblage(data.villager ?
			AssemblagesEnum.Villager :
			AssemblagesEnum.Agent);

		console.info(`Spawning: ${agentName} with entityId: ${entityId}`);

		// Get relevant state
		const positionState = this.entityManager.getComponentDataForEntity(
				ComponentEnum.Position, entityId) as IPositionState;
		const agentState = this.entityManager.getComponentDataForEntity(
				ComponentEnum.Agent, entityId) as IAgentState;
		const villagerState = this.entityManager.getComponentDataForEntity(
				ComponentEnum.Villager, entityId) as IVillagerState;
		const renderableState = this.entityManager.getComponentDataForEntity(
				ComponentEnum.Renderable, entityId) as IRenderableState;

		// Copy over the defaults for the agent
		const assemblageData = _.extend({}, agentsAssemblageData[agentName]);
		entityComponentData = _.merge(assemblageData, entityComponentData);
		this._copyNeededComponentData(entityId, entityComponentData, AssemblagesEnum.Agent);

		// If they specified options for the villager, assign them
		if (data.villager) {
			villagerState.job = data.villager.job !== undefined ?
				data.villager.job :
				villagerState.job;
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
        itemName: string,
        entityComponentData: IEntityComponentData = {}
    ): number {
		const assemblageData = _.extend({}, itemsAssemblageData[itemName]);
		entityComponentData = _.merge(assemblageData, entityComponentData);

		const entityId = this.entityManager.createEntityFromAssemblage(AssemblagesEnum.Item);

		this._copyNeededComponentData(entityId, entityComponentData, AssemblagesEnum.Item);

		const positionState = this.entityManager.getComponentDataForEntity(
				ComponentEnum.Position, entityId) as IPositionState,
			itemState = this.entityManager.getComponentDataForEntity(
				ComponentEnum.Item, entityId) as IItemState;

		const tileDoesntContainItem = (tile: MapTile): boolean => {
			return !baseUtil.tileContainsEntityOfComponent(ComponentEnum.Item, tile);
		};
		positionState.tile = globalRefs.map.getNearestEmptyTile(globalRefs.map.getTile(0, 0), tileDoesntContainItem);
		itemState.shouldBeSpawned = true;

		// this.itemManager.addItem(entityId);

		return entityId;
	}

	spawnItemsFromList (
		items: string[],
		entityComponentData: IEntityComponentData = {}
	): number[] {
		return this.itemNamesFromList(items).map(itemName => {
			return this.spawnItem(itemName);
		});
	}

	/**
	 * Creates a building in an already completed state
	 *
	 * @param  {Object} options The options containing what building to build and where
	 */
	spawnBuilding (
        buildingName: string,
		isCompleted: boolean = false,
        entityComponentData: IEntityComponentData = {}
    ): number {
		const assemblageData = _.extend({}, buildingsAssemblageData[buildingName]);
		entityComponentData = _.merge(assemblageData, entityComponentData);

		const entityId = this.entityManager.createEntityFromAssemblage(AssemblagesEnum.Building);

		console.info(`Spawning: ${buildingName} with entityId: ${entityId}`);

		this._copyNeededComponentData(entityId, entityComponentData, AssemblagesEnum.Building);

		const positionState = this.entityManager.getComponentDataForEntity(
			ComponentEnum.Position, entityId) as IPositionState;
		const map = globalRefs.map;
		positionState.tile = map.getTile(map.dimension / 4 - 1, map.dimension / 2 - 1);

		if (isCompleted) {
			const healthState = this.entityManager.getComponentDataForEntity(
				ComponentEnum.Health, entityId) as IHealthState;
			healthState.currentHealth = healthState.maxHealth;
		}

		// var tile = options.tile || this.map.getTile(options.position[0], options.position[1]);
		// Make sure to construct building and pass in gameManager instance
		// buildings.newBuilding(entityId);

		return entityId;
	}
}