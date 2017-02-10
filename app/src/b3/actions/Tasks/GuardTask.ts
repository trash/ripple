import * as Core from '../../core';
import * as Actions from '../index';
import {StatusBubble} from '../../../data/StatusBubble';
import {AgentTraits} from '../../../interfaces';
import {statusBubbleUtil} from '../../../entity/util/statusBubble';

const nearbyMonsterKey = 'guard-attack-nearby-monster';
const nearbyMonsterTileKey = nearbyMonsterKey + '-tile';

export class GuardTask extends Core.Sequence {
	constructor (guardTarget) {
		super({
			children: [
				// Hunt monsters
				new Core.Inverter({
					child: new Core.Sequence({
						children: [
							new Actions.CheckForNearbyAgent({
								traits: [AgentTraits.Monster, AgentTraits.Thief]
							}, nearbyMonsterKey, nearbyMonsterTileKey, 10),
							new Actions.HideBubble(StatusBubble.Guard),
							new Actions.GoToAttackTarget(nearbyMonsterKey,
                                nearbyMonsterTileKey)
						]
					}),
				}),
				new Actions.HideBubble(StatusBubble.Sword),
				new Actions.ShowBubble(StatusBubble.Guard),
				// If there aren't any path to your target
				new Actions.GoToTarget(guardTarget),
			]
		});
	}
	close (tick: Core.Tick) {
		super.close(tick);

        statusBubbleUtil.removeStatusBubble(tick.target.id, StatusBubble.Guard);
	};
};