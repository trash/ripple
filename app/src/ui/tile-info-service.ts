import {b3} from '../b3';
import {GameMap} from '../map';
import {MapTile} from '../map/tile';
import {events} from '../events';
import {store} from '../redux/store';
import {ChildStatus} from '../b3/core/child-status';
// Redux actions
import {updateHoverTile} from '../redux/actions/update-hover-tile';
import {updateHoveredAgentName} from '../redux/actions/update-hovered-agent-name';
import {updateHoveredResourceName} from '../redux/actions/update-hovered-resource-name';
import {updateHoveredItemName} from '../redux/actions/update-hovered-item-name';
import {updateHoveredBuildingName} from '../redux/actions/update-hovered-building-name';
import {updateHoveredAgentLastExecutionChain} from '../redux/actions/update-hovered-agent-last-execution-chain';

import {agentUtil} from '../entity/util/agent';
import {collisionUtil} from '../entity/util/collision';

import {EntityManager} from '../entity/entity-manager';
import {ComponentEnum} from '../entity/component-enum';

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

        // Get the name of any agent occupying the tile
        const agentsName = getNameOfEntityOccupyingThisTile(ComponentEnum.Agent);
        if (agentsName) {
            store.dispatch(updateHoveredAgentName(agentsName.name));

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
        const resourceName = getNameOfEntityOccupyingThisTile(ComponentEnum.Resource);
        if (resourceName) {
            store.dispatch(updateHoveredResourceName(resourceName.name));
        }

        // Get the name of any item occupying the tile
        const itemName = getNameOfEntityOccupyingThisTile(ComponentEnum.Item);
        if (itemName) {
            store.dispatch(updateHoveredItemName(itemName.name));
        }

        // Get the name of any building occupying the tile
        const buildingName = getNameOfEntityOccupyingThisTile(ComponentEnum.Building);
        if (buildingName) {
            store.dispatch(updateHoveredBuildingName(buildingName.name));
        }

        store.dispatch(updateHoverTile(tile));
	}
}