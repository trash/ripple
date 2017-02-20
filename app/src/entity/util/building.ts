import * as changeCase from 'change-case';
import {IRowColumnCoordinates} from '../../interfaces';
import {Component} from '../ComponentEnum';
import {BaseUtil} from './base';
import {constants} from '../../data/constants';
import {Profession} from '../../data/Profession';
import {Building} from '../../data/Building';

export class BuildingUtil extends BaseUtil {
	private getAllBuildings (): number[] {
        return this.entityManager.getEntityIdsForComponent(Component.Building);
    }

	getBuildingFromEntranceTile(
		entranceTile: IRowColumnCoordinates
	): number {
		const buildings = this.getAllBuildings();
		const index = buildings
			.map(building => this._getBuildingState(building))
			.findIndex(buildingState => buildingState.entranceTile === entranceTile);
		return buildings[index];
	}

	getTileFromBuilding (building: number): IRowColumnCoordinates {
		return this._getBuildingState(building).entranceTile;
	}

	getNearestBuildingWithOccupantSpace(): number {
		return this.getAllBuildings()[0];
	}

	buildingExistsByProfession(profession: Profession): boolean {
		return !!this.getAllBuildings().length;
	}

	getNearestBuildingByProfession(
		tile: IRowColumnCoordinates,
		profession: Profession
	): number {
		return this.getAllBuildings()[0];
	}

	getFreeHome (): number {
		return this.getAllBuildings()[0];
	}

	getName(building: Building): string {
        return changeCase.paramCase(Building[building]);
    }

    hasOccupancy(
		building: number
	): boolean {
        const buildingState = this._getBuildingState(building);

		return buildingState.occupants.length < buildingState.maxOccupants;
	}

	getImagePath(
		building: Building
	): string {
		const buildingName = this.getName(building);
		return `${constants.SPRITE_PATH}buildings/${buildingName}.png`;
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

	removeOccupant(
		building: number,
		agent: number
	) {
		const buildingState = this._getBuildingState(building);
		const index = buildingState.occupants.indexOf(agent);
		if (index === -1) {
			console.error('Removing an occupant that isnt in the building');
		}
		buildingState.occupants.splice(index, 1);
	}
}

export const buildingUtil = new BuildingUtil();