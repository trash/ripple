import {b3} from '../index';
import * as Core from '../Core';
import {ItemRequirements} from '../../ItemRequirements';
import {util} from '../../util';
import {IItemSearchResult} from '../../interfaces';
import {inventoryUtil} from '../../entity/util';

export class AddResourceToRequirements extends Core.BaseNode {
	blackboardKey: string;
	requiredResources: ItemRequirements;

	constructor (
		blackboardKey: string,
		requiredResources: ItemRequirements
	) {
		super();
		this.blackboardKey = blackboardKey;
		this.requiredResources = requiredResources;
	}
	tick (tick: Core.Tick) {
		const agentData = tick.target,
			target = util.blackboardGet(tick, this.blackboardKey) as IItemSearchResult;

		inventoryUtil.remove(agentData.id, target.id);

		this.requiredResources.addToRequirements(target);
		return b3.SUCCESS;
	}
}