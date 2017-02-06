import {Task} from './Task';
import * as Tasks from '../b3/actions/Tasks';
import {ResourceRequirements} from '../ResourceRequirements';
import {Profession} from '../data/profession';
import {StatusBubble} from '../data/StatusBubble';
import {Component} from '../entity/ComponentEnum';
import {events} from '../events';

import {IPositionState, IBuildingState, IConstructibleState,
	IHealthState} from '../entity/components';

import {baseUtil} from '../entity/util';
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
	requiredResources: ResourceRequirements;
	destinationTile: IRowColumnCoordinates;

	constructor (building: number) {
		// Call our parent constructor
		super({
			taskType: Profession.Builder,
			name: 'builder-task',
			maxInstancePool: 4,
			bubble: StatusBubble.Build
		});

		this.bubble = StatusBubble.Build;

		const positionState = baseUtil._getPositionState(building),
			constructibleState = baseUtil._getConstructibleState(building),
			healthState = baseUtil._getHealthState(building),
			buildingState = baseUtil._getBuildingState(building);

		this.setBehaviorTree(new Tasks.BuilderTask(healthState,
			constructibleState.resourceRequirements,
			buildingState.entranceTile, this));

		this.building = building;
		// The required resource for the task. This is used for the GetResourcesAction instance.
		// this.requiredResources = building.requiredResources;

		// Make the destination tile one to the left of the building
		// or entrance if it has one
		this.destinationTile = positionState.tile;
		// this.destinationTile = building.entrance ?
		// 	building.getEntranceTile() :
		// 	building.tile.leftSibling();
		this.description = `Building a ${ buildingState.name } at ${ this.destinationTile.column } \
			${ this.destinationTile.row }.`;

		this.effortRating = 3;

		// If it's a repair job make it only require a fraction of the resources based on damage
		// if (building.built) {
		// 	console.info(`The building needs to be in charge of how many resources are left to
		// 		repair it. If we try and assign this here itll be wrong if more damage is done
		// 		to the building after this task has been initilized.`);
		// }

		this.bindSuspendEvents();
	}

	// Bind to events for resources being added and removed and suspend appropriately
	// this should only be called by tasks that require resources to be completed
	bindSuspendEvents () {
		events.on('remove-from-resource', () => {
			if (!this.completed && this.isReady() && !this.checkIfReady()) {
				this.suspend();
			}
		});
		events.on(['resources', '*', 'add'], () => {
			if (!this.isReady() && this.checkIfReady()) {
				this.unsuspend();
			}
		});
	}

	checkIfReady (): boolean {
		return true;
		// return this.building.requiredResources.claimedResourcesExist();
	}

	/**
	 * Call the complete method on the buildign and complete the task
	 */
	complete () {
		// Call the building complete function one time
		if (!this.completed) {
			// this.building.complete();
		}

		Task.prototype.complete.call(this);
	}
}