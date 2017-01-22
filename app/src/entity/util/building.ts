import {IRowColumnCoordinates} from '../../interfaces';
import {ComponentEnum} from '../componentEnum';
import {BaseUtil} from './base';

export class BuildingUtil extends BaseUtil {
	private getAllBuildings (): number[] {
        return this.entityManager.getEntityIdsForComponent(ComponentEnum.Building);
    }

	getTileFromBuilding (building: number): IRowColumnCoordinates {
		return this._getBuildingState(building).entranceTile;
	}

	getNearestBuildingWithOccupantSpace(): number {
		return this.getAllBuildings()[0];
	}

	getFreeHome (): number {
		return this.getAllBuildings()[0];
	}

    hasOccupancy(
		building: number
	): boolean {
        const buildingState = this._getBuildingState(building);

		return buildingState.occupants.length < buildingState.maxOccupants;
	}

	addOccupant(
		building: number,
		agent: number
	) {
		// How can you enter if there's no room
		if (!this.hasOccupancy(building)) {
			console.error('Citizen entering a building that is already full');
		}
		const buildingState = this._getBuildingState(building);
		buildingState.occupants.push(agent);
	}
}

export const buildingUtil = new BuildingUtil();