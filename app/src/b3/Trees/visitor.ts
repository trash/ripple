import * as Core from '../../b3/Core';
import * as Action from '../../b3/Actions';
import {StatusBubble} from '../../data/StatusBubble';
import {Building} from '../../data/Building';

const itemToBuyKey = 'visitor-item-to-buy';

export const behaviorTree = new Core.BehaviorTree();
behaviorTree.root = new Core.Priority({
	children: [
		// new Action.ExitMapIfLeaveTownTrue(),
		new Core.Priority({
			children: [
				new Core.Sequence({
					children: [
						new Action.HasItemInInventory(itemToBuyKey),
						new Action.ShowBubble(StatusBubble.Happy),
						new Action.GoToExitMap()
					]
				}),
				new Action.GoBuyItem(itemToBuyKey)
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