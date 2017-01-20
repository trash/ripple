import {RandomAction} from '../core/random-action';
import {Repeater} from '../core/repeater';

import * as Actions from './index';

export class WaitWander extends RandomAction {
	constructor (wanderDistance: number = 3) {
		super({
			children: [
				new Repeater({ child: new Actions.Wait(), maxLoop: 3 }),
				new Repeater({ child: new Actions.Wander(), maxLoop: wanderDistance })
			]
		});
		this.description = 'Waiting or wandering.';
	}
}