import {b3} from '../index';
import * as Core from '../Core';
import {ResourceRequirements} from '../../ResourceRequirements';
import {util} from '../../util';
import {IItemSearchResult} from '../../interfaces';
import {inventoryUtil} from '../../entity/util';

export class AddResourceToRequirements extends Core.BaseNode {
	blackboardKey: string;
	requiredResources: ResourceRequirements;

	constructor (
		blackboardKey: string,
		requiredResources: ResourceRequirements
	) {
		super();
		this.blackboardKey = blackboardKey;
		this.requiredResources = requiredResources;
	}
	tick (tick: Core.Tick) {
		const agentData = tick.target,
			target = util.blackboardGet(tick, this.blackboardKey) as IItemSearchResult;

		inventoryUtil.remove(agentData.inventory, target.id);

		this.requiredResources.addToRequirements(target);
		return b3.SUCCESS;
	}
}