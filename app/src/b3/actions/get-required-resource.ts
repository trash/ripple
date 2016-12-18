import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';
import {ResourceRequirements} from '../../resource-requirements';
import {itemUtil} from '../../entity/util/item';
import {dropOffTargetKeyOrFunctionType, GoToTargetTarget} from '../../interfaces';

export class GetRequiredResource extends BaseNode {
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
	tick (tick: Tick) {
		const agentData = tick.target;
		let requiredResourceName = this.requiredResources.pickRequiredResource();
		if (!requiredResourceName) {
			return b3.FAILURE;
		}

		// Handle getting the drop off location from the object or key
		const dropOffLocation: GoToTargetTarget = util.targetKeyOrFunction(tick, this.dropOffTargetKeyOrFunction);
		if (!dropOffLocation) {
			console.error('this should probably be defined');
			return b3.FAILURE;
		}

		const requiredResource = itemUtil.getNearestItem(dropOffLocation.tile, {
			itemNames: requiredResourceName
		});

		if (!requiredResource) {
			return b3.RUNNING;
		}
		// Set the item to be stored so we don't have race conditions with
		// multiple resource fetchers
		requiredResource.state.toBeStored = true;

		const goToTargetTarget: GoToTargetTarget = {
			id: requiredResource.id,
			tile: requiredResource.position.tile
		};
		// Store the item search result and target to the GoToTarget action separately
		util.blackboardSet(tick, this.blackboardKey, requiredResource);
		util.blackboardSet(tick, this.goToTargetKey, goToTargetTarget);
		return b3.SUCCESS;
	}
}