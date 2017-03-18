import * as Core from '../../Core';
import * as Actions from '../index';
import {StatusBubble} from '../../../data/StatusBubble';
import {AgentTrait} from '../../../data/AgentTrait';
import {statusBubbleUtil} from '../../../entity/util/statusBubble';
import {positionUtil} from '../../../entity/util/position';

const nearbyMonsterKey = 'guard-attack-nearby-monster';
const nearbyMonsterTileKey = nearbyMonsterKey + '-tile';

export class GuardTask extends Core.Sequence {
	constructor (guardTarget: number) {
		super({
			children: [
				// Hunt monsters
				new Core.Inverter({
					child: new Core.Sequence({
						children: [
							new Actions.CheckForNearbyAgent({
								traits: [AgentTrait.Monster, AgentTrait.Thief]
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
				new Actions.GoToTarget(tick =>
					positionUtil.getTileFromEntityId(guardTarget)),
			]
		});
	}
	close (tick: Core.Tick) {
		super.close(tick);

        statusBubbleUtil.removeStatusBubble(tick.target.id, StatusBubble.Guard);
	};
};