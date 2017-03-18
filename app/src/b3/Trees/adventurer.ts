import {b3} from '../../b3';
import * as Core from '../../b3/Core';
import * as Action from '../../b3/Actions';
import {StatusBubble} from '../../data/StatusBubble';
import {Building} from '../../data/Building';
import {AgentTrait} from '../../data/AgentTrait';
import {statusBubbleUtil} from '../../entity/util';

const itemToBuyKey = 'visitor-item-to-buy';
const nearbyMonsterKey = 'guard-attack-nearby-monster';
const nearbyMonsterTileKey = nearbyMonsterKey + '-tile';

export const behaviorTree = new Core.BehaviorTree();
behaviorTree.root = new Core.Priority({
	children: [
		new Action.DefendSelf(),
        // First check for monsters then lairs and kill them if one is found
        new Core.Sequence({
            children: [
                new Action.CheckForNearbyAgent({
                    traits: [AgentTrait.Monster, AgentTrait.Thief]
                }, nearbyMonsterKey, nearbyMonsterTileKey, 10),
                new Action.GoToAttackTarget(nearbyMonsterKey, nearbyMonsterTileKey)
            ]
        }),
        // Buy items
        new Core.Sequence({
			children: [
				new Core.Inverter({
					child: new Action.HasItemInInventory(itemToBuyKey)
				}),
				new Action.GoBuyItem(itemToBuyKey),
				new Action.Simple(tick => {
					tick.target.visitor.boughtItem = true;
				}),
				new Action.ShowBubble(StatusBubble.Happy),
				Action.SimpleTimer((tick) => {
					statusBubbleUtil.removeStatusBubble(tick.target.id, StatusBubble.Happy);
				}, 2)
			]
		}),
        // Wander around otherwise
		new Action.WaitWander()
	]
});
behaviorTree.name = 'adventurer';