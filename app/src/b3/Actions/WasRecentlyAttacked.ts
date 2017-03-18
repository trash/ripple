import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';
import {positionUtil} from '../../entity/util';

export class WasRecentlyAttacked extends Core.BaseNode {
	turnsSinceLastAttack: number;
	blackboardKey: string;
	targetTileKey: string;

	constructor (
		blackboardKey: string,
		targetTileKey: string,
		turnsSinceLastAttack: number
	) {
		super();
		this.turnsSinceLastAttack = turnsSinceLastAttack;
		this.blackboardKey = blackboardKey;
		this.targetTileKey = targetTileKey;
	}

	tick (tick: Core.Tick) {
		const target = tick.target;
		const agent = target.agent;
		const wasRecentlyAttacked = agent.lastAttacked
			&& (target.turn - agent.lastAttacked)
				/ agent.speed < this.turnsSinceLastAttack;

		if (wasRecentlyAttacked) {
			// Store the attackers id
			util.blackboardSet(tick, this.blackboardKey, agent.lastAttacker);

			const attackerTile = positionUtil.getTileFromEntityId(agent.lastAttacker);
			// Store the attacker's tile
			util.blackboardSet(tick, this.targetTileKey, target.position.tile);
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}