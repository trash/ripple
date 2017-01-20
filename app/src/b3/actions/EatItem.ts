import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';
import {agentUtil} from '../../entity/util/agent';
import {IItemSearchResult} from '../../interfaces';

export class EatItem extends BaseNode {
	targetKey: string;

	constructor (key: string) {
		super();
		this.targetKey = key;
	}

	tick (tick: Tick) {
		const agentData = tick.target;
		const target = util.blackboardGet(tick, this.targetKey) as IItemSearchResult;

		console.log(agentData.name.name, 'is eating item');

		agentUtil.eatItem(tick.target.turn, agentData.id, target.id);

		return b3.SUCCESS;
	}
}