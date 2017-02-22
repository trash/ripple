import * as changeCase from 'change-case';
import {IRowColumnCoordinates} from '../../interfaces';
import {IBuildingState} from '../components';
import {Component} from '../ComponentEnum';
import {BaseUtil} from './base';
import {positionUtil} from './position';
import {constants} from '../../data/constants';
import {Profession} from '../../data/Profession';
import {Building} from '../../data/Building';
import {MapUtil} from '../../map/map-util';

type BuildingMapResult = {
	id: number;
	state: IBuildingState;
}

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

	private idToMapResult(id: number): BuildingMapResult {
		return {
			state: this._getBuildingState(id),
			id: id
		};
	}
	private mapResultToId(result: BuildingMapResult): number {
		return result.id;
	}

	getBuildingsByType(building: Building | null): BuildingMapResult[] {
		const buildings = this.getAllBuildings()
			.map(result => this.idToMapResult(result));
		// null means any
		if (building === null) {
			return buildings;
		}
		return buildings
			.filter(result => result.state.enum === building);
	}

	getNearestBuildingWithOccupantSpace(
		startTile: IRowColumnCoordinates,
		building: Building | null
	): number {
		const buildings = this.getBuildingsByType(building)
			.map(this.mapResultToId);
		const tiles = buildings.map(positionUtil.getTileFromEntityId);
		const index = MapUtil.nearestTileFromSet(startTile, tiles);
		return buildings[index];
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
		console.info('This should be checking against all buildings with "house" property');
		return this.getBuildingsByType(Building.Hut)
			.map(result => this.mapResultToId(result))
			[0];
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