import {b3} from '../index';
import {util} from '../../util';
import * as Core from '../core';
import {agentUtil} from '../../entity/util/agent';

/**
 * An action to just make a citizen wait for a turn
 */
export class EnterBuilding extends Core.BaseNode {
	blackboardKey: string;

	constructor (blackboardKey: string) {
		super();
		this.blackboardKey = blackboardKey;
	}

	tick (tick: Core.Tick) {
		const target = tick.target;
		const building = util.blackboardGet(tick, this.blackboardKey);

		agentUtil.enterBuilding(target.turn, target.id, building);
		return b3.SUCCESS;
	}
}