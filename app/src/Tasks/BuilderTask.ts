import {Task} from './Task';
import * as Tasks from '../b3/Actions/Tasks';
import {ItemRequirements} from '../ItemRequirements';
import {Profession} from '../data/Profession';
import {StatusBubble} from '../data/StatusBubble';
import {Component} from '../entity/ComponentEnum';
import {events} from '../events';

import {IPositionState, IBuildingState, IConstructibleState,
	IHealthState} from '../entity/components';

import {baseUtil, itemUtil} from '../entity/util';
import {IRowColumnCoordinates} from '../interfaces';

/**
* Creates a new BuilderTask object.
*
* @classdesc A task associated with a building to be built.
*
* @extends {Task}
*
* @constructor
* @param {Building} building The building to build for this task.
*/
export class BuilderTask extends Task {
	building: number;
	resourceRequirements: ItemRequirements;
	destinationTile: IRowColumnCoordinates;
	readyCheckInterval: number;

	constructor (building: number) {
		super({
			taskType: Profession.Builder,
			name: 'builder-task',
			maxInstancePool: 4,
			bubble: StatusBubble.Build
		});

		const positionState = baseUtil._getPositionState(building);
		const constructibleState = baseUtil._getConstructibleState(building);
		const healthState = baseUtil._getHealthState(building);
		const buildingState = baseUtil._getBuildingState(building);

		this.setBehaviorTree(
			new Tasks.BuilderTask(
				healthState,
				constructibleState.resourceRequirements,
				buildingState.entranceTile, this
			)
		);

		this.building = building;
		this.resourceRequirements = constructibleState.resourceRequirements;

		// Make the destination tile one to the left of the building
		// or entrance if it has one
		this.destinationTile = positionState.tile;

		this.description = `Building a ${ buildingState.name } at ${ this.destinationTile.column } \
			${ this.destinationTile.row }.`;

		this.effortRating = 3;

		// If it's a repair job make it only require a fraction of the resources based on damage
		// if (building.built) {
		// 	console.info(`The building needs to be in charge of how many resources are left to
		// 		repair it. If we try and assign this here itll be wrong if more damage is done
		// 		to the building after this task has been initilized.`);
		// }

		this.readyCheckInterval = setInterval(() => this.readyCheck(), 1000);
	}

	// Bind to events for resources being added and removed and suspend appropriately
	// this should only be called by tasks that require resources to be completed
	private readyCheck () {
		// Check if it's no longer ready
		if (this.isReady() && !this.checkIfReady()) {
			this.suspend();
		}
		// Check if it's ready again
		if (!this.isReady() && this.checkIfReady()) {
			this.unsuspend();
		}
	}

	private checkIfReady (): boolean {
		if (this.resourceRequirements.isCompleted()) {
			return true;
		}
		return itemUtil.itemExists({
			itemEnums: [this.resourceRequirements.pickRequiredItem()],
			toBeStored: false
		});
	}

	complete() {
		clearInterval(this.readyCheckInterval);
		super.complete();
	}
}