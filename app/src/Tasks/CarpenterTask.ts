import {CraftTask} from './CraftTask';
import {Profession} from '../data/profession';
import {StatusBubble} from '../data/StatusBubble';

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
export class CarpenterTask extends CraftTask {
	constructor (item: string) {
		// Call our parent constructor
		super({
			name: 'carpenter-task',
			taskType: Profession.Carpenter,
			bubble: StatusBubble.Build
		}, item);
	}
};