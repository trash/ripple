import * as Core from '../../core';
import * as Actions from '../index';

export class HarvesterTask extends Core.Sequence {
	constructor (resource, task) {
		const tile = task.getTileFromResource(resource);
		const resourceTile = resource.tile;

		super({
			children: [
				new Actions.GoToTarget(tile),
				new Actions.FaceTile(tile),
				new Actions.HarvestResource(resource, task)
			]
		});
	}
}