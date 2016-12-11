import {b3} from '../b3';
import {GameMap} from '../map';
import {MapTile} from '../map/tile';
import {events} from '../events';
import {store} from '../redux/store';
import {updateHoverTile} from '../redux/actions/update-hover-tile';
import {updateHoveredAgentName} from '../redux/actions/update-hovered-agent-name';
import {updateHoveredResourceName} from '../redux/actions/update-hovered-resource-name';
import {updateHoveredItemName} from '../redux/actions/update-hovered-item-name';
import {agentUtil} from '../entity/util/agent';
import {EntityManager} from '../entity/entity-manager';
import {ComponentEnum} from '../entity/component-enum';
import {INameState} from '../entity/components/name';
import {IPositionState} from '../entity/components/position';
import {IBehaviorTreeState} from '../entity/components/behavior-tree';

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

        const filterEntityByTile = (entityId: number) => {
            const positionState = this.entityManager.getComponentDataForEntity(
                ComponentEnum.Position, entityId) as IPositionState;
            return tile.isEqualToCoords(positionState.tile);
        };
        const getNameFromEntity = (entityId: number) => {
            return this.entityManager.getComponentDataForEntity(
                ComponentEnum.Name, entityId);
        };

        const getEntitiesWithComponentInTile = (componentName: ComponentEnum) => {
            return Object.keys(
                this.entityManager.getEntitiesWithComponent(componentName))
                    .map(entityId => parseInt(entityId))
                    .filter(filterEntityByTile);
        }

        const getNameOfEntityOccupyingTile = (componentName: ComponentEnum): INameState => {
            return getEntitiesWithComponentInTile(componentName)
                    .map(getNameFromEntity)[0] as INameState;
        };

        // Get the name of any agent occupying the tile
        const agentsName = getNameOfEntityOccupyingTile(ComponentEnum.Agent);
        if (agentsName) {
            store.dispatch(updateHoveredAgentName(agentsName.name));

            // Expose info about the agent's behavior tree
            const behaviorTreeState = getEntitiesWithComponentInTile(ComponentEnum.Agent)
                    .map(entityId => this.entityManager.getComponentDataForEntity(
                        ComponentEnum.BehaviorTree, entityId)
                    )[0] as IBehaviorTreeState;
            console.log(
                `Two choices for inspecting an agent's actions:`,
                behaviorTreeState.blackboard.get('lastExecutionChain',
                    behaviorTreeState.tree.id),
                behaviorTreeState.tree.root.childrenStatus
                    .map(status => {
                        return {
                            status: b3.humanReadableStatus(status.status),
                            child: status.child
                        };
                    })
            );
        }

        // Get the name of any resource occupying the tile
        const resourceName = getNameOfEntityOccupyingTile(ComponentEnum.Resource);
        if (resourceName) {
            store.dispatch(updateHoveredResourceName(resourceName.name));
        }

        // Get the name of any item occupying the tile
        const itemName = getNameOfEntityOccupyingTile(ComponentEnum.Item);
        if (itemName) {
            store.dispatch(updateHoveredItemName(itemName.name));
        }

        store.dispatch(updateHoverTile(tile));
	}
}