import {Sequence} from '../../core/sequence';
import {GoToTarget} from '../go-to-target';
import {HarvestResource} from '../harvest-resource';
import {FaceTile} from '../face-tile';

export class HarvesterTask extends Sequence {
	constructor (resource, task) {
		const tile = task.getTileFromResource(resource);
		const resourceTile = resource.tile;

		super({
			children: [
				new GoToTarget(tile),
				new FaceTile(tile),
				new HarvestResource(resource, task)
			]
		});
	}
}