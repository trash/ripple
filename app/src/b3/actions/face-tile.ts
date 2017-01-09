import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';

import {IRowColumnCoordinates} from '../../interfaces';
import {positionUtil} from '../../entity/util/position';

export class FaceTile extends BaseNode {
	tile: IRowColumnCoordinates;

	constructor (tile: IRowColumnCoordinates) {
		super();
		this.tile = tile;
		if (!tile) {
			console.error('FaceTile instantiated without a tile');
		}
	}

	tick (tick: Tick) {
		const agentData = tick.target;
		const direction = positionUtil.directionToTile(agentData.position.tile, this.tile);

		agentData.position.direction = direction;

		return b3.SUCCESS;
	}
}