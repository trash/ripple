import {b3} from '../index';
import {util} from '../../util';
import * as Core from '../Core';
import {agentUtil} from '../../entity/util';

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
		const building: number = util.blackboardGet(tick, this.blackboardKey);

		if (target.agent.buildingInsideOf === building) {
			return b3.SUCCESS;
		}

		agentUtil.enterBuilding(target.turn, target.id, building);
		return b3.SUCCESS;
	}
}