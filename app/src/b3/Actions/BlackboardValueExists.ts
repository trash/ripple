import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';

export class BlackboardValueExists extends Core.BaseNode {
	blackboardKey: string;

	constructor (blackboardKey) {
		super();
		this.blackboardKey = blackboardKey;
	}
	tick (tick: Core.Tick) {
		if (util.blackboardGet(tick, this.blackboardKey)) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}