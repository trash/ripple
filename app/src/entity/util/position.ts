import {BaseUtil} from './base';
import {Direction, IRowColumnCoordinates} from '../../interfaces';

export class PositionUtil extends BaseUtil {
    getTileFromEntityId (id: number) {
        return this._getPositionState(id).tile;
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
}

export const positionUtil = new PositionUtil();