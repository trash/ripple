import * as Core from '../core';
import * as Actions from './index';

export class WaitWander extends Core.RandomAction {
	constructor (wanderDistance: number = 3) {
		super({
			children: [
				new Core.Repeater({ child: new Actions.Wait(), maxLoop: 3 }),
				new Core.Repeater({ child: new Actions.Wander(), maxLoop: wanderDistance })
			]
		});
		this.description = 'Waiting or wandering.';
	}
}