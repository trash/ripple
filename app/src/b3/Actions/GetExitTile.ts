import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';
import {globalRefs} from '../../globalRefs';

export class GetExitTile extends Core.BaseNode {
	blackboardKey: string;

	constructor (blackboardKey: string) {
		super();
		this.blackboardKey = blackboardKey;
	}
	tick (tick: Core.Tick) {
        const exitTile = globalRefs.map.getNearestExitTile(tick.target.position.tile);

		if (exitTile) {
			util.blackboardSet(tick, this.blackboardKey, exitTile);

			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
};