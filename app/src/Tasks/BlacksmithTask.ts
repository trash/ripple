import {CraftTask} from './CraftTask';
import {Profession} from '../data/Profession';
import {StatusBubble} from '../data/StatusBubble';
import {Item} from '../data/Item';

/**
* Creates a new CarpenterTask object.
*
* @classdesc A task associated with a carpenter making something.
*
* @extends {CraftTask}
*
* @constructor
* @param {Object} good The good object from CarpenterGoods.
*/
export class BlacksmithTask extends CraftTask {
	constructor (item: Item) {
		// Call our parent constructor
		super({
			name: 'blacksmith-task',
			taskType: Profession.Blacksmith,
			bubble: StatusBubble.Build
		}, item);
	}
};