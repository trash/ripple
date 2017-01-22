import {b3} from '../index';
import * as Core from '../Core';

import {IRowColumnCoordinates} from '../../interfaces';
import {positionUtil} from '../../entity/util';

export class FaceTile extends Core.BaseNode {
	tile: IRowColumnCoordinates;

	constructor (tile: IRowColumnCoordinates) {
		super();
		this.tile = tile;
		if (!tile) {
			console.error('FaceTile instantiated without a tile');
		}
	}

	tick (tick: Core.Tick) {
		const agentData = tick.target;
		const direction = positionUtil.directionToTile(agentData.position.tile, this.tile);

		agentData.position.direction = direction;

		return b3.SUCCESS;
	}
}