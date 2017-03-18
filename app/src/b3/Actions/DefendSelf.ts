import * as Core from '../../b3/Core';
import * as Actions from '../../b3/Actions';

const wasRecentlyAttackedKey = 'was-recently-attacked';
const attackerTileKey = 'attacker-tile';

export class DefendSelf extends Core.Sequence {
	constructor () {
		super({
			children: [
				new Actions.WasRecentlyAttacked(
                    wasRecentlyAttackedKey,
                    attackerTileKey,
                    3
                ),
				new Actions.GoToAttackTarget(wasRecentlyAttackedKey, attackerTileKey)
			]
		});
	}
};