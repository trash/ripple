import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';
import {ResourceRequirements} from '../../resource-requirements';
import {itemUtil} from '../../entity/util/item';

type DropOffTargetKeyOrFunction = string | Function;

export class GetRequiredResource extends BaseNode {
	blackboardKey: string;
	requiredResources: ResourceRequirements;
	dropOffTargetKeyOrFunction: DropOffTargetKeyOrFunction;

	constructor (
		blackboardKey: string,
		requiredResources: ResourceRequirements,
		dropOffTargetKeyOrFunction: DropOffTargetKeyOrFunction
	) {
		super();
		this.blackboardKey = blackboardKey;
		this.requiredResources = requiredResources;
		this.dropOffTargetKeyOrFunction = dropOffTargetKeyOrFunction;
	}
	tick (tick: Tick) {
		const agentData = tick.target;
		let requiredResourceName = this.requiredResources.pickRequiredResource();
		if (!requiredResourceName) {
			return b3.FAILURE;
		}

		// Handle getting the drop off location from the object or key
		var dropOffLocation = util.targetKeyOrFunction(tick, this.dropOffTargetKeyOrFunction);
		if (!dropOffLocation) {
			console.error('this should probably be defined');
			return b3.FAILURE;
		}

		const requiredResource = itemUtil.getNearestItem(dropOffLocation, {
			itemNames: requiredResourceName
		});
		if (!requiredResource) {
			return b3.RUNNING;
		}
		// Set the item to be stored so we don't have race conditions with
		// multiple resource fetchers
		requiredResource.state.toBeStored = true;
		util.blackboardSet(tick, this.blackboardKey, requiredResource);
		return b3.SUCCESS;
	}
}