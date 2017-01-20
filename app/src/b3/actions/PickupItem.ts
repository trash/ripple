import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';
import {IItemSearchResult} from '../../interfaces';
import {itemUtil} from '../../entity/util/item';
import {inventoryUtil} from '../../entity/util/inventory';

export class PickupItem extends BaseNode {
	targetKey: string;

	constructor (targetKey: string) {
		super();
		this.targetKey = targetKey;
	}
	tick (tick: Tick) {
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