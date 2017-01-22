import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';
import {IItemSearchResult} from '../../interfaces';

/**
 * This is meant to handle the handoff of an item that should be eaten,
 * as far as cancelling any appropriate tasks associated with the item.
 * This might be generalized.
 *
 * @param {String} key target key
 */
export class HandleFoodToBeEaten extends Core.BaseNode {
	targetKey: string;

	constructor (key: string) {
		super();
		this.targetKey = key;
	}

	tick (tick: Core.Tick) {
		const agentData = tick.target;
        const food = util.blackboardGet(tick, this.targetKey) as IItemSearchResult;

		// Trying to eat an item that's not in a tile is a bad sign
		if (!food.position.tile) {
			debugger;
		}

		// We need to cancel the hauler task
		if (food.state.haulerTask) {
			console.error('we need to handle cleaning up hauler tasks');
			// food.haulerTask.cancel();
			food.state.toBeStored = false;
		}

		return b3.SUCCESS;
	}
}