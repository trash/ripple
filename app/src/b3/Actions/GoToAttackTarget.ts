import * as Core from '../Core';
import * as Actions from './index';
import {util} from '../../util';
import {StatusBubble} from '../../data/StatusBubble';
import {statusBubbleUtil} from '../../entity/util';


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
				new Actions.GoToTarget(targetTileKey, 1, (tick, target) => {
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
