import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {ResourceRequirements} from '../../resource-requirements';

export class AllResourcesGathered extends BaseNode {
	requiredResources: ResourceRequirements;

	constructor (
		requiredResources: ResourceRequirements
	) {
		super();
		this.requiredResources = requiredResources;
	}

	tick (tick: Tick) {
		const requiredResource = this.requiredResources.pickRequiredResource();
		if (!requiredResource) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}