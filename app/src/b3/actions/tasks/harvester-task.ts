import {Sequence} from '../../core/sequence';
// import {GoToTarget} from '../go-to-target';
// import {HarvestResource} from '../harvest-resource';
// import {CallMethod} from '../call-method';
// import {FaceTile} from '../face-tile';

export class HarvesterTask extends Sequence {
	constructor (resource, task) {
		let tile = task.getTileFromResource(resource),
			resourceTile = resource.tile;
		super({
			children: [
				// new GoToTarget(tile),
				// new FaceTile(tile),
				// new HarvestResource(resource, task)
			]
		});
	}
};