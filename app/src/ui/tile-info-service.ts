import {GameMap} from '../map';
import {MapTile} from '../map/tile';
import {events} from '../events';
import {store} from '../redux/store';
import {updateHoverTile} from '../redux/actions/update-hover-tile';
import {updateHoveredAgentName} from '../redux/actions/update-hovered-agent-name';
import {agentUtil} from '../entity/util/agent';
import {EntityManager} from '../entity/entity-manager';
import {ComponentEnum} from '../entity/component-enum';
import {INameState} from '../entity/components/name';
import {IPositionState} from '../entity/components/position';

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

        // Get the name of any agent occupying the tile
        const agentsName = Object.keys(this.entityManager
            .getEntitiesWithComponent(ComponentEnum.Agent))
            .map(entityId => parseInt(entityId))
            .filter(entityId => {
                const positionState = this.entityManager.getComponentDataForEntity(
                    ComponentEnum.Position, entityId) as IPositionState;
                return tile.isEqualToCoords(positionState.tile);
            })
            .map(entityId => {
                return this.entityManager.getComponentDataForEntity(
                    ComponentEnum.Name, entityId);
            })[0] as INameState;

        if (agentsName) {
            store.dispatch(updateHoveredAgentName(agentsName.name));
        }

        store.dispatch(updateHoverTile(tile));
	}
}