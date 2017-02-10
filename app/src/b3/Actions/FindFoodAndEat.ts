import * as Core from '../Core';
import {util} from '../../util';
import {StatusBubble} from '../../data/StatusBubble';

import * as Actions from './index';

import {ItemProperty, IItemSearchResult} from '../../interfaces';

const foodKey = 'find-food-item';

export class FindFoodAndEat extends Core.Sequence {
	description: string;
	updatesCurrentAction: boolean;

	constructor () {
		super({
			children: [
				new Actions.ShowBubble(StatusBubble.Hunger),
				new Actions.CheckForNearbyItem(foodKey, {
					properties: [ItemProperty.Food]
				}, null, true),
				new Actions.HandleFoodToBeEaten(foodKey),
				new Actions.GoToTarget(tick =>
					(util.blackboardGet(tick, foodKey) as IItemSearchResult).position.tile),
				// eat the item
				new Actions.EatItem(foodKey),
				new Actions.HideBubble(StatusBubble.Hunger)
			]
		});
		this.description = `Going to eat something.`;
	}

	tick (tick: Core.Tick) {
		return super.tick(tick);
	}
}