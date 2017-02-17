import {b3} from '../../b3';
import * as Core from '../../b3/Core';
import * as Action from '../../b3/Actions';
import {StatusBubble} from '../../data/StatusBubble';
import {Building} from '../../data/Building';
import {statusBubbleUtil} from '../../entity/util';

const itemToBuyKey = 'visitor-item-to-buy';

export const behaviorTree = new Core.BehaviorTree();
behaviorTree.root = new Core.Priority({
	children: [
		new Core.Sequence({
			children: [
				new Action.IsTrue(tick => tick.target.visitor.leaveTown),
				Action.GoToExitMap()
			]
		}),
		// Make them flee and leave town if they've been attacked recently
		new Core.Sequence({
			children: [
				new Action.WasRecentlyAttacked(null, 10),
				new Action.Simple(tick => {
					tick.target.visitor!.leaveTown = true;
				})
			]
		}),
		// Go buy an item if they haven't already
		new Core.Sequence({
			children: [
				new Core.Inverter({
					child: new Action.HasItemInInventory(itemToBuyKey)
				}),
				new Action.GoBuyItem(itemToBuyKey),
				new Action.ShowBubble(StatusBubble.Happy),
				Action.SimpleTimer((tick) => {
					statusBubbleUtil.removeStatusBubble(tick.target.id, StatusBubble.Happy);
				}, 2)
			]
		}),
		new Core.Sequence({
			children: [
				new Core.Priority({
					children: [
						// new Action.HangOutIn(Building.Tavern),
						new Action.WaitWander()
				]}),
				new Core.Timer({
					child: new Core.Sequence({
						children: [
							new Action.ShowBubble(StatusBubble.Sad),
							new Action.Simple(tick => {
								tick.target.visitor!.leaveTown = true;
							})
						]
					}),
					hours: 24
				})
			]
		})
	]
});
behaviorTree.name = 'visitor';