import {BaseUtil} from './base';
import {Direction, IRowColumnCoordinates} from '../../interfaces';
import {Component} from '../ComponentEnum';
import {collisionUtil} from './collision';
import {buildingUtil} from './building';
import {IPositionState, ICollisionState, IBuildingState} from '../Components';
import {util} from '../../util';

export class PositionUtil extends BaseUtil {
    getTileFromEntityId (id: number) {
		const building = this._getBuildingState(id);
		if (building) {
			return buildingUtil.getTileFromBuilding(id);
		}
		const positionState = this._getPositionState(id);
		if (!positionState) {
			console.error('No position state found for entity.');
			return null;
		}
        return positionState.tile;
    }

    directionToTile (
        tile: IRowColumnCoordinates,
        nextTile: IRowColumnCoordinates
    ): Direction {
		const rowDiff = nextTile.row - tile.row;
		const columnDiff = nextTile.column - tile.column;

		// Vertical
		if (rowDiff) {
			// Down
			if (rowDiff > 0) {
				return 'down';
			}
			// Up
			else {
				return 'up';
			}
		}
		// Horizontal
		else if (columnDiff) {
			// Right
			if (columnDiff > 0) {
				return 'right';
			}
			// Left
			else {
				return 'left';
			}
		}
		return null;
	}

	private filterEntityByTile(
		tile: IRowColumnCoordinates,
		entityId: number
	): boolean {
		const collisionState = this.entityManager.getComponentDataForEntity(
			Component.Collision, entityId) as ICollisionState;
		const positionState = this.entityManager.getComponentDataForEntity(
			Component.Position, entityId) as IPositionState;

		if (!positionState || !positionState.tile) {
			return false;
		}

		// Need to check each tile occupied by the collidable body
		if (collisionState) {
			return collisionUtil.getTilesFromCollisionEntity(entityId)
				.some(coords => {
					return util.rowColumnCoordinatesAreEqual(tile, coords);
				});
		}
		return util.rowColumnCoordinatesAreEqual(tile, positionState.tile);
	}

	getEntitiesWithComponentInTile(
		tile: IRowColumnCoordinates,
		componentName: Component
	): number[] {
		return Object.keys(
			this.entityManager.getEntitiesWithComponent(componentName))
				.map(entityId => parseInt(entityId))
				.filter(entityId => this.filterEntityByTile(tile, entityId));
	}

	destroyEntityOfComponentTypeInTile(
		tile: IRowColumnCoordinates,
		componentType: Component
	): number {
		const entities = this.getEntitiesWithComponentInTile(tile, componentType);
		const entityToDestroy = entities[0];
		if (!entityToDestroy) {
			return null;
		}
		this.entityManager.destroyEntity(entityToDestroy);
		return entityToDestroy;
	}

	setTile (
		positionState: IPositionState,
		tile: IRowColumnCoordinates,
		turn: number,
		speed: number
	) {
		positionState.previousTile = positionState.tile;
		positionState.tile = tile;
		positionState.turnUpdated = turn;
		positionState.turnCompleted = turn + speed;
	}
}

export const positionUtil = new PositionUtil();