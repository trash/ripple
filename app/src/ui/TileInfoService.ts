import {b3} from '../b3';
import {GameMap} from '../map';
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

import {agentUtil, collisionUtil, positionUtil} from '../entity/util';

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
    IVillagerState
} from '../entity/components';

import {IRowColumnCoordinates} from '../interfaces';
import {util} from '../util';

const getNameFromEntity = (
    entityManager: EntityManager,
    entityId: number
) => {
    return entityManager.getComponentDataForEntity(
        Component.Name, entityId);
};

const getNameOfEntityOccupyingTile = (
    entityManager: EntityManager,
    tile: IRowColumnCoordinates,
    componentName: Component
): INameState => {
    return positionUtil.getEntitiesWithComponentInTile(tile, componentName)
            .map(entity => getNameFromEntity(entityManager, entity))[0] as INameState;
};

export class TileInfoService {
    hoverListenerOff: Function;
    previousTile: IRowColumnCoordinates;
    entityManager: EntityManager;

    constructor (entityManager: EntityManager) {
        this.entityManager = entityManager;
        events.on('map-update', (map: GameMap) => {
            this.updateMap(map);
        });
    }

    updateMap (map: GameMap) {
        this.hoverListenerOff = map.addTileHoverListener(tile => this.onTileHover(tile));
		// this.clickListenerOff = map.addTileClickListener(tile => this.onTileClick(tile));
    }

    onTileHover (tile: IRowColumnCoordinates) {
		if (!tile
            || (this.previousTile
                && util.rowColumnCoordinatesAreEqual(tile, this.previousTile)
            )
        ) {
			return;
		}
        this.previousTile = tile;

        const getNameOfEntityOccupyingThisTile = (componentName: Component) => {
            return getNameOfEntityOccupyingTile(this.entityManager, tile, componentName);
        }

        const getEntityWithComponentInTile = (
            component: Component
        ): number => {
            return positionUtil.getEntitiesWithComponentInTile(tile, component)[0];
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
            const villagerState = this.entityManager.getComponentDataForEntity(
                Component.Villager, agent) as IVillagerState;
            store.dispatch(updateHoveredAgent(
                agentState,
                hungerState,
                sleepState,
                positionState,
                villagerState
            ));

            // Expose info about the agent's behavior tree
            const behaviorTreeState = positionUtil.getEntitiesWithComponentInTile(
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

            if (backupExecutionChain) {
                // store.dispatch(updateHoveredAgentLastExecutionChain(executionChain));
                store.dispatch(updateHoveredAgentLastExecutionChain(backupExecutionChain.success.reverse()));
            }
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