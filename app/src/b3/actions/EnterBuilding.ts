import {b3} from '../index';
import {util} from '../../util';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {agentUtil} from '../../entity/util/agent';

/**
 * An action to just make a citizen wait for a turn
 */
export class EnterBuilding extends BaseNode {
	blackboardKey: string;

	constructor (blackboardKey: string) {
		super();
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Tick) {
		const target = tick.target;
		const building = util.blackboardGet(tick, this.blackboardKey);

		agentUtil.enterBuilding(target.turn, target.id, building);
		return b3.SUCCESS;
	}
}