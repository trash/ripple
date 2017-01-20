import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';

export class Wander extends BaseNode {
	distance: number;

	constructor (distance: number = 3) {
		super();
		this.initialize();

		this.description = 'Wandering.';

		this.distance = distance;
	}

	open (tick: Tick) {
		const randomTile = tick.target.map.getRandomTile({
			accessible: true,
			range: 1,
			baseTile: tick.target.position.tile
		});
		if (!randomTile) {
			debugger;
		}

		util.blackboardSet(tick, 'arrived', false);
		util.blackboardSet(tick, 'destination', randomTile);
	}

	tick (tick: Tick) {
		var arrived = util.blackboardGet(tick, 'arrived');
		if (!arrived) {
			util.blackboardSet(tick, 'arrived', true);
			// testLog.log('should be wandering');
			const randomTile = util.blackboardGet(tick, 'destination');
			if (!randomTile) {
				console.error('for some reason randomTile is undefined?? ignoring this for now...');
			} else {
				util.setTile(tick.target.position, randomTile, tick.target.turn, tick.target.agent.speed);
			}
			return b3.RUNNING;
		}
		return b3.SUCCESS;
	}
}