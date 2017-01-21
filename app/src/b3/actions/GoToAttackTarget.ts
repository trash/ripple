import {StatusBubble} from '../../data/status-bubble';
import * as Core from '../core';
import {util} from '../../util';
import {statusBubbleUtil} from '../../entity/util/status-bubble';

import * as Actions from './index';

export class GoToAttackTarget extends Core.Sequence {
	constructor (
		targetKey: string,
		targetTileKey: string
	) {
		super({
			children: [
				new Core.Inverter({
					child: new Actions.CheckIfAgentIsDead(targetKey)
				}),
				new Actions.ShowBubble(StatusBubble.Sword),
				new Actions.GoToTarget(targetTileKey, (tick, target) => {
					this.setDescription(tick,
						`going to attack agent @ \
						${target}`);
				}),
				new Actions.AttackTarget(targetKey),
			]
		});
		this.description = 'go to attack target';
	}
	close (tick: Core.Tick) {
		super.close(tick);

		statusBubbleUtil.removeStatusBubble(tick.target.id, StatusBubble.Sword);
	}
}
