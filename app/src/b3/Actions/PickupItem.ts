import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';
import {IItemSearchResult} from '../../interfaces';
import {itemUtil} from '../../entity/util';
import {inventoryUtil} from '../../entity/util';

export class PickupItem extends Core.BaseNode {
	targetKey: string;

	constructor (targetKey: string) {
		super();
		this.targetKey = targetKey;
	}
	tick (tick: Core.Tick) {
		const agentData = tick.target;
		const target = util.blackboardGet(tick, this.targetKey) as IItemSearchResult;

		inventoryUtil.add(agentData.inventory, target.id);
		if (agentData.villager) {
			target.state.claimed = true;
		}
		itemUtil.removeFromTile(target.id);

		return b3.SUCCESS;
	}
}