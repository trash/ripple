import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';
import {positionUtil} from '../../entity/util';
import {IRowColumnCoordinates} from '../../interfaces';

export class Wander extends Core.BaseNode {
	distance: number;

	constructor (distance: number = 3) {
		super();
		this.initialize();

		this.description = 'Wandering.';

		this.distance = distance;
	}

	open (tick: Core.Tick) {
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

	tick (tick: Core.Tick) {
		const target = tick.target;
		const arrived = util.blackboardGet(tick, 'arrived');
		if (!arrived) {
			util.blackboardSet(tick, 'arrived', true);
			// testLog.log('should be wandering');
			const randomTile: IRowColumnCoordinates = util.blackboardGet(
				tick,
				'destination'
			);
			if (!randomTile) {
				console.error('for some reason randomTile is undefined?? ignoring this for now...');
			} else {
				positionUtil.setTile(
					target.position,
					randomTile,
					target.turn,
					target.agent.speed
				);
			}
			return b3.RUNNING;
		}
		return b3.SUCCESS;
	}
}