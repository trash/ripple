import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';

export class PathAroundMap extends BaseNode {
	constructor () {
		super();
		this.initialize();

		this.description = 'Wandering.';
	}

	tick (tick: Tick) {
		const agentData = tick.target,
			currentTileCoords = agentData.position.tile,
			dimension = agentData.map.dimension;
		const currentTile = agentData.map.getTileFromCoords(currentTileCoords);
		let nextTileIndex: number;

		// If top row and not at right end go right
		if (currentTile.row === 0 && currentTile.column < dimension - 1) {
			nextTileIndex = currentTile.rightSibling();
		// Along right side go down
		}  else if (currentTile.column === dimension - 1 && currentTile.row < dimension - 1) {
			nextTileIndex = currentTile.bottomSibling();
		// Along bottom go left
		} else if (currentTile.row === dimension - 1 && currentTile.column > 0) {
			nextTileIndex = currentTile.leftSibling();
		// Along left go up
		} else if (currentTile.column === 0 && currentTile.row > 0) {
			nextTileIndex = currentTile.topSibling();
		}

		const nextTile = agentData.map.getTileByIndex(nextTileIndex);
		if (!nextTile) {
			debugger;
		}

		util.setTile(agentData.position, nextTile, agentData.turn, agentData.agent.speed);

		return b3.SUCCESS;
	}
};