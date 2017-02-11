import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';
import {ResourceRequirements} from '../../ResourceRequirements';
import {itemUtil} from '../../entity/util';
import {dropOffTargetKeyOrFunctionType, IRowColumnCoordinates} from '../../interfaces';

export class GetRequiredResource extends Core.BaseNode {
	blackboardKey: string;
	goToTargetKey: string;
	requiredResources: ResourceRequirements;
	dropOffTargetKeyOrFunction: dropOffTargetKeyOrFunctionType;

	constructor (
		blackboardKey: string,
		goToTargetKey: string,
		requiredResources: ResourceRequirements,
		dropOffTargetKeyOrFunction: dropOffTargetKeyOrFunctionType
	) {
		super();
		this.blackboardKey = blackboardKey;
		this.goToTargetKey = goToTargetKey;
		this.requiredResources = requiredResources;
		this.dropOffTargetKeyOrFunction = dropOffTargetKeyOrFunction;
	}
	tick (tick: Core.Tick) {
		const agentData = tick.target;
		const requiredResourceType = this.requiredResources.pickRequiredResource();
		if (!requiredResourceType) {
			return b3.FAILURE;
		}

		// Handle getting the drop off location from the object or key
		const dropOffLocation: IRowColumnCoordinates = util.targetKeyOrFunction(
			tick,
			this.dropOffTargetKeyOrFunction
		);
		if (!dropOffLocation) {
			console.error('this should probably be defined');
			return b3.FAILURE;
		}

		const requiredResource = itemUtil.getNearestItem(dropOffLocation, {
			itemEnums: [requiredResourceType]
		});

		if (!requiredResource) {
			return b3.RUNNING;
		}
		// Set the item to be stored so we don't have race conditions with
		// multiple resource fetchers
		requiredResource.state.toBeStored = true;

		// Store the item search result and target to the GoToTarget action separately
		util.blackboardSet(tick, this.blackboardKey, requiredResource);
		util.blackboardSet(tick, this.goToTargetKey, requiredResource.position.tile);
		return b3.SUCCESS;
	}
}