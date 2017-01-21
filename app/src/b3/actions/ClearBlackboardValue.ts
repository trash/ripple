import {b3} from '../index';
import * as Core from '../core';
import {util} from '../../util';

export class ClearBlackboardValue extends Core.BaseNode {
	blackboardKey: string;

	constructor (blackboardKey) {
		super();
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Core.Tick) {
		util.blackboardSet(tick, this.blackboardKey, null);
		return b3.SUCCESS;
	}
}