import {BaseUtil} from './base';
import {Direction, IRowColumnCoordinates} from '../../interfaces';
import {Component} from '../ComponentEnum';
import {collisionUtil} from './collision';
import {buildingUtil} from './building';
import {IPositionState, ICollisionState, IBuildingState} from '../Components';
import {Util} from '../../util';

export class PositionUtil extends BaseUtil {
	/**
	 * Gets the tile from the entity with given id.
	 * For buildings by default it will return the entrance tile unless
	 * noEntrance is passed in as true.
	 * @param id
	 * @param noEntrance
	 */
    getTileFromEntityId (id: number, noEntrance = false) {
		const building = this._getBuildingState(id);
		if (building && !noEntrance) {
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
		if (!nextTile) {
			return null;
		}

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

	/**
	 * Returns true if the entity occupies the given tile.
	 * @param tile
	 * @param entityId
	 */
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
				.some(coords => Util.rowColumnCoordinatesAreEqual(tile, coords));
		}
		return Util.rowColumnCoordinatesAreEqual(tile, positionState.tile);
	}

	getEntitiesWithComponentInTile(
		tile: IRowColumnCoordinates,
		componentName: Component
	): number[] {
		return Object.keys(this.entityManager.getEntitiesWithComponent(componentName))
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
		positionState.dirty = true;
	}
}

export const positionUtil = new PositionUtil();