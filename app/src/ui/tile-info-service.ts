import {b3} from '../b3';
import {GameMap} from '../map';
import {MapTile} from '../map/tile';
import {events} from '../events';
import {store} from '../redux/store';
import {ChildStatus} from '../b3/Core';
// Redux actions
import {
    updateHoverTile,
    updateHoveredAgent,
    updateHoveredResource,
    updateHoveredItem,
    updateHoveredBuilding,
    updateHoveredAgentLastExecutionChain
} from '../redux/actions';

import {agentUtil, collisionUtil} from '../entity/util';

import {EntityManager} from '../entity/entityManager';
import {Component} from '../entity/ComponentEnum';

import {
    IResourceState,
    IAgentState,
    IHungerState,
    ISleepState,
    IItemState,
    IBuildingState,
    IConstructibleState,
    INameState,
    IPositionState,
    ICollisionState,
    IBehaviorTreeState,
} from '../entity/components';

const filterEntityByTile = (
    entityManager: EntityManager,
    tile: MapTile,
    entityId: number
) => {
    const collisionState = entityManager.getComponentDataForEntity(
        Component.Collision, entityId) as ICollisionState;
    const positionState = entityManager.getComponentDataForEntity(
        Component.Position, entityId) as IPositionState;

    if (!positionState || !positionState.tile) {
        return false;
    }

    // Need to check each tile occupied by the collidable body
    if (collisionState) {
        return collisionUtil.getTilesFromCollisionEntity(entityId).some(coords => {
            return tile.isEqualToCoords(coords);
        });
    }
    return tile.isEqualToCoords(positionState.tile);
};
const getNameFromEntity = (
    entityManager: EntityManager,
    entityId: number
) => {
    return entityManager.getComponentDataForEntity(
        Component.Name, entityId);
};

const getEntitiesWithComponentInTile = (
    entityManager: EntityManager,
    tile: MapTile,
    componentName: Component
) => {
    return Object.keys(
        entityManager.getEntitiesWithComponent(componentName))
            .map(entityId => parseInt(entityId))
            .filter(filterEntityByTile.bind(this, entityManager, tile));
}

const getNameOfEntityOccupyingTile = (
    entityManager: EntityManager,
    tile: MapTile,
    componentName: Component
): INameState => {
    return getEntitiesWithComponentInTile(entityManager, tile, componentName)
            .map(getNameFromEntity.bind(this, entityManager))[0] as INameState;
};

export class TileInfoService {
    hoverListenerOff: Function;
    previousTile: MapTile;
    entityManager: EntityManager;

    constructor (entityManager: EntityManager) {
        this.entityManager = entityManager;
        events.on('map-update', (map: GameMap) => {
            this.updateMap(map);
        });
    }

    updateMap (map: GameMap) {
        this.hoverListenerOff = map.addTileHoverListener(this.onTileHover.bind(this));
		// this.clickListenerOff = map.addTileClickListener(this.onTileClick.bind(this));
    }

    onTileHover (tile: MapTile) {
		if (!tile || (this.previousTile && tile.isEqual(this.previousTile))) {
			return;
		}
        this.previousTile = tile;

        const getNameOfEntityOccupyingThisTile = (componentName: Component) => {
            return getNameOfEntityOccupyingTile(this.entityManager, tile, componentName);
        }

        const getEntityWithComponentInTile = (
            component: Component
        ): number => {
            return getEntitiesWithComponentInTile(this.entityManager, tile, component)[0];
        }

        // Get the name of any agent occupying the tile
        const agent = getEntityWithComponentInTile(Component.Agent);
        if (agent) {
            const agentState = this.entityManager.getComponentDataForEntity(
                Component.Agent, agent) as IAgentState;
            const hungerState = this.entityManager.getComponentDataForEntity(
                Component.Hunger, agent) as IHungerState;
            const sleepState = this.entityManager.getComponentDataForEntity(
                Component.Sleep, agent) as ISleepState;
            const positionState = this.entityManager.getComponentDataForEntity(
                Component.Position, agent) as IPositionState;
            store.dispatch(updateHoveredAgent(agentState, hungerState, sleepState, positionState));

            // Expose info about the agent's behavior tree
            const behaviorTreeState = getEntitiesWithComponentInTile(
                        this.entityManager,
                        tile,
                        Component.Agent
                    ).map(entityId => this.entityManager.getComponentDataForEntity(
                        Component.BehaviorTree, entityId)
                    )[0] as IBehaviorTreeState;
            const backupExecutionChain = behaviorTreeState.blackboard
                .get('lastExecutionChain', behaviorTreeState.tree.id) as {
                    success: ChildStatus[];
                    failure: ChildStatus[];
                }
            const executionChain = behaviorTreeState.tree.getExecutionChain();
            console.info(executionChain);
            console.info(backupExecutionChain);

            // store.dispatch(updateHoveredAgentLastExecutionChain(executionChain));
            store.dispatch(updateHoveredAgentLastExecutionChain(backupExecutionChain.success.reverse()));
        }

        // Get the name of any resource occupying the tile
        const resource = getEntityWithComponentInTile(Component.Resource);
        if (resource) {
            const resourceState = this.entityManager.getComponentDataForEntity(
                Component.Resource, resource) as IResourceState;
            store.dispatch(updateHoveredResource(resourceState));
        }

        // Get the name of any item occupying the tile
        const item = getEntityWithComponentInTile(Component.Item);
        if (item) {
            const itemState = this.entityManager.getComponentDataForEntity(
                Component.Item, item) as IItemState;
            store.dispatch(updateHoveredItem(itemState));
        }

        // Get the name of any building occupying the tile
        const building = getEntityWithComponentInTile(Component.Building);
        if (building) {
            const buildingState = this.entityManager.getComponentDataForEntity(
                Component.Building, building) as IBuildingState;
            const constructibleState = this.entityManager.getComponentDataForEntity(
                Component.Constructible, building) as IConstructibleState;
            store.dispatch(updateHoveredBuilding(buildingState, constructibleState));
        }

        store.dispatch(updateHoverTile(tile));
	}
}