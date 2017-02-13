import * as _ from 'lodash';
import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';
import {inventoryUtil} from '../../entity/util/inventory';

export class HasItemInInventory extends Core.BaseNode {
	blackboardKey: string;

	constructor (blackboardKey: string) {
		super();
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Core.Tick) {
        const item: number = util.blackboardGet(tick, this.blackboardKey);
		if (!_.isNumber(item)) {
			return b3.FAILURE;
		}
		const value = inventoryUtil.contains(tick.target.inventory, item);

		if (value) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	};
}