import {b3} from '../index';
import * as Core from '../Core';
import {ResourceRequirements} from '../../ResourceRequirements';

export class AllResourcesGathered extends Core.BaseNode {
	resourceRequirements: ResourceRequirements;

	constructor (
		resourceRequirements: ResourceRequirements
	) {
		super();
		this.resourceRequirements = resourceRequirements;
	}

	tick (tick: Core.Tick) {
		const requiredResource = this.resourceRequirements.pickRequiredResource();
		if (!requiredResource) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}