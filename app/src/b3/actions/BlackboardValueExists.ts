import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';

export class BlackboardValueExists extends BaseNode {
	blackboardKey: string;

	constructor (blackboardKey) {
		super();
		this.blackboardKey = blackboardKey;
	}
	tick (tick: Tick) {
		if (util.blackboardGet(tick, this.blackboardKey)) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}