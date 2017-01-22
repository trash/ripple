import {b3} from '../index';
import * as Core from '../Core';
import {ResourceRequirements} from '../../resource-requirements';

export class AllResourcesGathered extends Core.BaseNode {
	requiredResources: ResourceRequirements;

	constructor (
		requiredResources: ResourceRequirements
	) {
		super();
		this.requiredResources = requiredResources;
	}

	tick (tick: Core.Tick) {
		const requiredResource = this.requiredResources.pickRequiredResource();
		if (!requiredResource) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}