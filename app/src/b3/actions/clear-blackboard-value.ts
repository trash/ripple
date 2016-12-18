import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';

export class ClearBlackboardValue extends BaseNode {
	blackboardKey: string;

	constructor (blackboardKey) {
		super();
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Tick) {
		util.blackboardSet(tick, this.blackboardKey, null);
		return b3.SUCCESS;
	}
}