import {RandomAction} from '../core/random-action';
import {Repeater} from '../core/repeater';
import {Wait as WaitAction} from './wait';
import {WanderAction} from './wander';

export class WaitWander extends RandomAction {
	constructor (wanderDistance: number = 3) {
		super({
			children: [
				new Repeater({ child: new WaitAction(), maxLoop: 3 }),
				new Repeater({ child: new WanderAction(), maxLoop: wanderDistance })
			]
		});
		this.description = 'Waiting or wandering.';
	}

}