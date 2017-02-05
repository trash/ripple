import * as _ from 'lodash';;
import {Task, ITaskOptions} from './Task';
import * as Tasks from '../b3/Actions/Tasks';
import {StatusBubble} from '../data/statusBubble';
import {Component} from '../entity/ComponentEnum';
import {IPositionState} from '../entity/components';
import {baseUtil} from '../entity/util';
import {IRowColumnCoordinates} from '../interfaces';

/**
* Creates a new HarvesterTask object.
*
* @classdesc A task associated with harvesting a generic resource on the map.
*
* @extends {Task}
*
* @constructor
* @param {Resource} resource The resource on the map to be harvested.
*/
export abstract class HarvesterTask extends Task {
	destinationTile: IRowColumnCoordinates;
	resourceEntityId: number;

	constructor (options: ITaskOptions, resourceEntityId: number) {
		// Call our parent constructor
		super(options);
		this.setBehaviorTree(new Tasks.HarvesterTask(resourceEntityId, this));


		this.resourceEntityId = resourceEntityId;
		this.destinationTile = this.getTileFromResource(resourceEntityId);

		// Harvesting is a pain in the ass so it has 10x effort rating
		this.effortRating = 10;

		// Max people who can work on task. Leave up to extending class
		this.maxInstancePool = 2;

		// Description of the harvesting task
		this.description = `Harvesting a resource at ${this.destinationTile.column},
			${this.destinationTile.row}.`;
	}

	getTileFromResource (resourceEntityId: number): IRowColumnCoordinates {
		const positionState = baseUtil._getPositionState(resourceEntityId);
		return positionState.tile;
		// return resource.getAccessibleTile() || resource.tile;
	};
};