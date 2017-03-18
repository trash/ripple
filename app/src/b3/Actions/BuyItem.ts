import {b3} from '../index';
import * as Core from '../Core';

import {util} from '../../util';
import {agentUtil} from '../../entity/util/agent';

export class BuyItem extends Core.BaseNode {
	blackboardKey: string;

	constructor (blackboardKey: string) {
		super();
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Core.Tick) {
        const item: number = util.blackboardGet(tick, this.blackboardKey);

		agentUtil.buyItem(tick.target.id, item);

		return b3.SUCCESS;
	}
};