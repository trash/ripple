import _ = require('lodash');
import {Task, ITaskOptions} from './task';
import {HarvesterTask as HarvesterTaskAction} from '../b3/actions/tasks/harvester-task';
import {Tile} from '../map/tile';
import {ComponentEnum} from '../entity/component-enum';
import {IPositionState} from '../entity/components/position';
import {baseUtil} from '../entity/util/base';

interface IHarvesterTaskOptions extends ITaskOptions {
	bubble: string;
}

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
	destinationTile: Tile;
	resourceEntityId: number;

	constructor (options: IHarvesterTaskOptions, resourceEntityId: number) {
		// Call our parent constructor
		super(options);
		this.bubble = options.bubble;
		this.setBehaviorTree(new HarvesterTaskAction(resourceEntityId, this));


		this.resourceEntityId = resourceEntityId;
		this.destinationTile = this.getTileFromResource(resourceEntityId);

		// Harvesting is a pain in the ass so it has 10x effort rating
		this.effortRating = 10;

		// Max people who can work on task. Leave up to extending class
		this.maxInstancePool = 2;

		// Description of the harvesting task
		this.description = 'Harvesting a resource at ' + this.destinationTile.column + ',' +
			this.destinationTile.row + '.';
	}

	getTileFromResource (resourceEntityId: number): Tile {
		const positionState = baseUtil._getPositionState(resourceEntityId);
		return positionState.tile;
		// return resource.getAccessibleTile() || resource.tile;
	};
};