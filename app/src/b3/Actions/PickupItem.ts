import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';
import {IItemSearchResult} from '../../interfaces';
import {agentUtil} from '../../entity/util/agent';

export class PickupItem extends Core.BaseNode {
	targetKey: string;

	constructor (targetKey: string) {
		super();
		this.targetKey = targetKey;
	}
	tick (tick: Core.Tick) {
		const target = util.blackboardGet(tick, this.targetKey) as IItemSearchResult;

		agentUtil.pickupItem(tick.target.id, target.id);

		return b3.SUCCESS;
	}
}