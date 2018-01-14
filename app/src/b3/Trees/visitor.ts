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
				new Action.WasRecentlyAttacked(null, null, 10),
				new Action.Simple(tick => {
					tick.target.visitor!.leaveTown = true;
				})
			]
		}),
		// Go buy items if they have money left and there're items to buy
		new Core.Sequence({
			children: [
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
		new Core.Sequence({
			children: [
				// Idle activities
				new Core.Priority({
					children: [
						// new Action.HangOutIn(Building.Tavern),
						new Action.WaitWander()
				]}),
				// Leave town after 24 hours
				new Core.Timer({
					child: new Core.Sequence({
						children: [
							new Action.Simple(tick => {
								tick.target.visitor!.leaveTown = true;
							}),
							// Leave town sad if they didn't buy an item
							new Core.Sequence({
								children: [
									new Action.IsTrue(tick => !tick.target.visitor.boughtItem),
									new Action.ShowBubble(StatusBubble.Sad),
								]
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