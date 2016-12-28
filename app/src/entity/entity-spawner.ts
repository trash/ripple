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

export class EntitySpawner {
    entityManager: EntityManager;
    map: GameMap;
    // itemManager: ItemManager;

    constructor (entityManager: EntityManager, map: GameMap) {
        this.entityManager = entityManager;
        this.map = map;
        // this.itemManager = itemManager;
    }

    copyComponentData (entityId: number, pair) {
		if (pair[0]) {
			const entityState = this.entityManager.getComponentDataForEntity(pair[1] as ComponentEnum, entityId);
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
	spawnAgent (data: IAgentAssemblageTestData, entityComponentData: IEntityComponentData = {}) {
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
		positionState.tile = this.map.getTile(0, 0);

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
		positionState.tile = this.map.getNearestEmptyTile(this.map.getTile(0, 0), tileDoesntContainItem);
		itemState.shouldBeSpawned = true;

		// this.itemManager.addItem(entityId);

		return entityId;
	}

	/**
	 * Creates a building in an already completed state
	 *
	 * @param  {Object} options The options containing what building to build and where
	 */
	spawnBuilding (
        buildingName: string,
        entityComponentData: IEntityComponentData = {}
    ): number {
		const assemblageData = _.extend({}, buildingsAssemblageData[buildingName]);
		entityComponentData = _.merge(assemblageData, entityComponentData);

		const entityId = this.entityManager.createEntityFromAssemblage(AssemblagesEnum.Building);

		this._copyNeededComponentData(entityId, entityComponentData, AssemblagesEnum.Building);

		const positionState = this.entityManager.getComponentDataForEntity(
			ComponentEnum.Position, entityId) as IPositionState;
		const map = this.map;
		positionState.tile = map.getTile(map.dimension / 4 - 1, map.dimension / 2 - 1);

		// var tile = options.tile || this.map.getTile(options.position[0], options.position[1]);
		// Make sure to construct building and pass in gameManager instance
		// buildings.newBuilding(entityId);

		return entityId;
	}
}