import * as Core from '../Core';
import * as Action from '../../b3/Actions';

import {visitorUtil, positionUtil} from '../../entity/util';
import {StatusBubble} from '../../data/StatusBubble';

const itemToBuyKey = 'item-to-buy';
const itemToBuyBuildingKey = 'item-to-buy-building';

export class GoBuyItem extends Core.Sequence {
	constructor (blackboardKey: string = itemToBuyKey) {
		let itemId: number;
		super({
			children: [
                new Action.IsTrue(tick =>
					!!visitorUtil.getItemToBuy(tick.target.id)
				),
				new Action.SetBlackboardValue(blackboardKey, tick => {
					itemId = visitorUtil.getItemToBuy(tick.target.id).id;
					return itemId;
				}),
				new Action.BuildingFromItem(blackboardKey, itemToBuyBuildingKey),
				// new Action.ShopIsOpen(itemToBuyBuildingKey),
				new Action.ShowBubble(StatusBubble.Coin),
				new Action.GoToTarget(() => positionUtil.getTileFromEntityId(itemId)),
				new Action.EnterBuilding(itemToBuyBuildingKey),
				new Action.BuyItem(blackboardKey),
				new Action.HideBubble(StatusBubble.Coin)
			]
		});
	}
};