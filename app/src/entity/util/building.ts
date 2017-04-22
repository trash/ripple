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
import {spriteUtil} from '../../util/sprite';

type BuildingMapResult = {
	id: number;
	state: IBuildingState;
}

export class BuildingUtil extends BaseUtil {
	private getAllBuildings (): number[] {
        return this.entityManager.getEntityIdsForComponent(Component.Building);
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

	private buildingIsComplete(id: number): boolean {
		const healthState = this._getHealthState(id);
		return healthState.currentHealth === healthState.maxHealth;
	}

	private hasOccupancyById(
		building: number
	): boolean {
        const buildingState = this._getBuildingState(building);

		return this.buildingHasOccupancyByState(buildingState);
	}

	private buildingHasOccupancyByState(state: IBuildingState): boolean {
		return state.occupants.length < state.maxOccupants;
	}

	private buildingHasResidencyAvailable(state: IBuildingState): boolean {
		return state.residents.length < state.maxOccupants;
	}

	addResident(building: number, agent: number): void {
		const state = this._getBuildingState(building);
		state.residents.push(agent);
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

	occupancyToString(state: IBuildingState): string {
		return `${state.occupants.length}/${state.maxOccupants}`;
	}
	occupancyToStringWithNames(state: IBuildingState): string {
		return state.occupants.reduce((nameString, occupant) => {
			const nameState = this._getNameState(occupant);
			if (nameString.length) {
				nameString += ', ';
			}
			return nameString += nameState.name;
		}, '');
	}

	buildingHasOccupancy(id: number): boolean {
		return this.buildingHasOccupancyByState(this._getBuildingState(id));
	}

	/**
	 * Returns all buildings of a given type.
	 * Returns all buildings if the type is null.
	 * @param building The type of building. Possibly null.
	 */
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
			// Only enter completed buildings
			.filter(result => this.buildingIsComplete(result.id))
			// Buildings with occupancy space
			.filter(result => this.buildingHasOccupancyByState(result.state))
			.map(this.mapResultToId);
		const tiles = buildings.map(id => positionUtil.getTileFromEntityId(id));
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
		return this.getAllBuildings()
			.map(id => this.idToMapResult(id))
			.filter(result => result.state.isHouse
				&& this.buildingIsComplete(result.id)
			)
			.filter(result => this.buildingHasResidencyAvailable(result.state))
			.map(result => this.mapResultToId(result))
			[0];
	}

	getName(building: Building): string {
        return changeCase.paramCase(Building[building]);
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
	): void {
		// How can you enter if there's no room
		if (!this.hasOccupancyById(building)) {
			console.error('Citizen entering a building that is already full');
		}
		const buildingState = this._getBuildingState(building);
		buildingState.occupants.push(agent);
	}

	removeOccupant(
		building: number,
		agent: number
	): void {
		const buildingState = this._getBuildingState(building);
		const index = buildingState.occupants.indexOf(agent);
		if (index === -1) {
			console.error('Removing an occupant that isnt in the building');
		}
		buildingState.occupants.splice(index, 1);
	}

	showGoldEarned(value: number, building: number): void {
		const renderableState = this._getRenderableState(building);
		const tile = positionUtil.getTileFromEntityId(building);
		spriteUtil.showGoldEarned(value, renderableState.spriteGroup, tile);
	}
}

export const buildingUtil = new BuildingUtil();