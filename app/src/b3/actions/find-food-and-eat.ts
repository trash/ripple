import {Sequence} from '../core/sequence';
import {Tick} from '../core/tick';
import {util} from '../../util';
import {StatusBubble} from '../../data/status-bubble';

import {CheckForNearbyItem} from './check-for-nearby-item';
import {EatItem} from './eat-item';
import {ShowBubble} from './show-bubble';
import {HideBubble} from './hide-bubble';
import {HandleFoodToBeEaten} from './handle-food-to-be-eaten';
import {GoToTarget} from './go-to-target';
import {ItemProperties, IItemSearchResult} from '../../interfaces';

const foodKey = 'find-food-item';

export class FindFoodAndEat extends Sequence {
	description: string;
	updatesCurrentAction: boolean;

	constructor () {
		super({
			children: [
				new ShowBubble(StatusBubble.Hunger),
				new CheckForNearbyItem(foodKey, {
					properties: [ItemProperties.food]
				}, null, true),
				new HandleFoodToBeEaten(foodKey),
				new GoToTarget(tick =>
					(util.blackboardGet(tick, foodKey) as IItemSearchResult).position.tile),
				// eat the item
				new EatItem(foodKey),
				new HideBubble(StatusBubble.Hunger)
			]
		});
		this.description = `Going to eat something.`;
	}

	tick (tick: Tick) {
		return super.tick(tick);
	}
}