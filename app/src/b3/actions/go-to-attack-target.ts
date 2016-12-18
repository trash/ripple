import {Sequence} from '../core/sequence';
import {Tick} from '../core/tick';
import {AttackTarget} from './attack-target';
import {GoToTarget} from './go-to-target';
import {ShowBubble} from './show-bubble';
import {HideBubble} from './hide-bubble';
import {CheckIfAgentIsDead} from './check-if-agent-is-dead';
import {Inverter} from '../core/inverter';
import {util} from '../../util';
import {statusBubbleUtil} from '../../entity/util/status-bubble';

export class GoToAttackTarget extends Sequence {
	constructor (
		targetKey: string,
		targetTileKey: string
	) {
		super({
			children: [
				new Inverter({
					child: new CheckIfAgentIsDead(targetKey)
				}),
				new ShowBubble('sword'),
				new GoToTarget(targetTileKey, (tick, target) => {
					this.setDescription(tick,
						`going to attack agent @ \
						${target}`);
				}),
				new AttackTarget(targetKey),
			]
		});
		this.description = 'go to attack target';
	}
	close (tick: Tick) {
		super.close(tick);

		statusBubbleUtil.removeStatusBubble(tick.target.statusBubble, 'sword');
	}
}
