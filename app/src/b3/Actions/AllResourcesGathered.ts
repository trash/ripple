import {b3} from '../index';
import * as Core from '../Core';
import {ItemRequirements} from '../../ItemRequirements';

export class AllResourcesGathered extends Core.BaseNode {
	resourceRequirements: ItemRequirements;

	constructor (
		resourceRequirements: ItemRequirements
	) {
		super();
		this.resourceRequirements = resourceRequirements;
	}

	tick (tick: Core.Tick) {
		const requiredResource = this.resourceRequirements.pickRequiredItem();
		if (!requiredResource) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}