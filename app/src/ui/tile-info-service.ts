import {b3} from '../b3';
import {GameMap} from '../map';
import {MapTile} from '../map/tile';
import {events} from '../events';
import {store} from '../redux/store';
import {ChildStatus} from '../b3/core';
// Redux actions
import {updateHoverTile} from '../redux/actions/update-hover-tile';
import {updateHoveredAgent} from '../redux/actions/update-hovered-agent';
import {updateHoveredResource} from '../redux/actions/update-hovered-resource';
import {updateHoveredItem} from '../redux/actions/update-hovered-item';
import {updateHoveredBuilding} from '../redux/actions/update-hovered-building';
import {updateHoveredAgentLastExecutionChain} from '../redux/actions/update-hovered-agent-last-execution-chain';

import {agentUtil} from '../entity/util/agent';
import {collisionUtil} from '../entity/util/collision';

import {EntityManager} from '../entity/entity-manager';
import {ComponentEnum} from '../entity/component-enum';

import {IResourceState} from '../entity/components/resource';
import {IAgentState} from '../entity/components/agent';
import {IHungerState} from '../entity/components/hunger';
import {ISleepState} from '../entity/components/sleep';
import {IItemState} from '../entity/components/item';
import {IBuildingState} from '../entity/components/building';
import {IConstructibleState} from '../entity/components/constructible';
import {INameState} from '../entity/components/name';
import {IPositionState} from '../entity/components/position';
import {ICollisionState} from '../entity/components/collision';
import {IBehaviorTreeState} from '../entity/components/behavior-tree';

const filterEntityByTile = (
    entityManager: EntityManager,
    tile: MapTile,
    entityId: number
) => {
    const collisionState = entityManager.getComponentDataForEntity(
        ComponentEnum.Collision, entityId) as ICollisionState;
    const positionState = entityManager.getComponentDataForEntity(
        ComponentEnum.Position, entityId) as IPositionState;

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
        ComponentEnum.Name, entityId);
};

const getEntitiesWithComponentInTile = (
    entityManager: EntityManager,
    tile: MapTile,
    componentName: ComponentEnum
) => {
    return Object.keys(
        entityManager.getEntitiesWithComponent(componentName))
            .map(entityId => parseInt(entityId))
            .filter(filterEntityByTile.bind(this, entityManager, tile));
}

const getNameOfEntityOccupyingTile = (
    entityManager: EntityManager,
    tile: MapTile,
    componentName: ComponentEnum
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

        const getNameOfEntityOccupyingThisTile = (componentName: ComponentEnum) => {
            return getNameOfEntityOccupyingTile(this.entityManager, tile, componentName);
        }

        const getEntityWithComponentInTile = (
            component: ComponentEnum
        ): number => {
            return getEntitiesWithComponentInTile(this.entityManager, tile, component)[0];
        }

        // Get the name of any agent occupying the tile
        const agent = getEntityWithComponentInTile(ComponentEnum.Agent);
        if (agent) {
            const agentState = this.entityManager.getComponentDataForEntity(
                ComponentEnum.Agent, agent) as IAgentState;
            const hungerState = this.entityManager.getComponentDataForEntity(
                ComponentEnum.Hunger, agent) as IHungerState;
            const sleepState = this.entityManager.getComponentDataForEntity(
                ComponentEnum.Sleep, agent) as ISleepState;
            const positionState = this.entityManager.getComponentDataForEntity(
                ComponentEnum.Position, agent) as IPositionState;
            store.dispatch(updateHoveredAgent(agentState, hungerState, sleepState, positionState));

            // Expose info about the agent's behavior tree
            const behaviorTreeState = getEntitiesWithComponentInTile(
                        this.entityManager,
                        tile,
                        ComponentEnum.Agent
                    ).map(entityId => this.entityManager.getComponentDataForEntity(
                        ComponentEnum.BehaviorTree, entityId)
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
        const resource = getEntityWithComponentInTile(ComponentEnum.Resource);
        if (resource) {
            const resourceState = this.entityManager.getComponentDataForEntity(
                ComponentEnum.Resource, resource) as IResourceState;
            store.dispatch(updateHoveredResource(resourceState));
        }

        // Get the name of any item occupying the tile
        const item = getEntityWithComponentInTile(ComponentEnum.Item);
        if (item) {
            const itemState = this.entityManager.getComponentDataForEntity(
                ComponentEnum.Item, item) as IItemState;
            store.dispatch(updateHoveredItem(itemState));
        }

        // Get the name of any building occupying the tile
        const building = getEntityWithComponentInTile(ComponentEnum.Building);
        if (building) {
            const buildingState = this.entityManager.getComponentDataForEntity(
                ComponentEnum.Building, building) as IBuildingState;
            const constructibleState = this.entityManager.getComponentDataForEntity(
                ComponentEnum.Constructible, building) as IConstructibleState;
            store.dispatch(updateHoveredBuilding(buildingState, constructibleState));
        }

        store.dispatch(updateHoverTile(tile));
	}
}