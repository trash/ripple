import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Priority} from '../core/priority';
import {Sequence} from '../core/sequence';
import {Tick} from '../core/tick';
import {util} from '../../util';

class ShouldMoveRight extends BaseNode {
	tick (tick: Tick) {
		const agentData = tick.target,
			currentTileCoords = agentData.position.tile,
			dimension = agentData.map.dimension,
			currentTile = agentData.map.getTileFromCoords(currentTileCoords);

		if (currentTile.row === 0 && currentTile.column < dimension - 1) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}
class ShouldMoveDown extends BaseNode {
	tick (tick: Tick) {
		const agentData = tick.target,
			currentTileCoords = agentData.position.tile,
			dimension = agentData.map.dimension,
			currentTile = agentData.map.getTileFromCoords(currentTileCoords);

		if (currentTile.column === dimension - 1 && currentTile.row < dimension - 1) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}
class ShouldMoveLeft extends BaseNode {
	tick (tick: Tick) {
		const agentData = tick.target,
			currentTileCoords = agentData.position.tile,
			dimension = agentData.map.dimension,
			currentTile = agentData.map.getTileFromCoords(currentTileCoords);

		if (currentTile.row === dimension - 1 && currentTile.column > 0) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}
class ShouldMoveUp extends BaseNode {
	tick (tick: Tick) {
		const agentData = tick.target,
			currentTileCoords = agentData.position.tile,
			dimension = agentData.map.dimension,
			currentTile = agentData.map.getTileFromCoords(currentTileCoords);

		if (currentTile.column === 0 && currentTile.row > 0) {
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}

class Move extends BaseNode {
	direction: string;
	constructor (direction: string) {
		super();
		this.direction = direction;
	}

	tick (tick: Tick) {
		const agentData = tick.target,
			currentTileCoords = agentData.position.tile,
			dimension = agentData.map.dimension;
		const currentTile = agentData.map.getTileFromCoords(currentTileCoords);

		let nextTileIndex: number;
		switch (this.direction) {
			case 'right':
				nextTileIndex = currentTile.rightSibling();
				break;
			case 'down':
				nextTileIndex = currentTile.bottomSibling();
				break;
			case 'left':
				nextTileIndex = currentTile.leftSibling();
				break;
			case 'up':
				nextTileIndex = currentTile.topSibling();
				break;

		}

		const nextTile = agentData.map.getTileByIndex(nextTileIndex);
		if (!nextTile) {
			debugger;
		}

		util.setTile(agentData.position, nextTile, agentData.turn, agentData.agent.speed);
		return b3.SUCCESS;
	}
}

export class PathAroundMap extends Priority {
	constructor () {
		super({
			children: [
				new Sequence({
					children: [
						new ShouldMoveUp(),
						new Move('up')
					]
				}),
				new Sequence({
					children: [
						new ShouldMoveRight(),
						new Move('right')
					]
				}),
				new Sequence({
					children: [
						new ShouldMoveDown(),
						new Move('down')
					]
				}),
				new Sequence({
					children: [
						new ShouldMoveLeft(),
						new Move('left')
					]
				}),
			]
		});
	}
}

export class OldPathAroundMap extends BaseNode {
	static description = 'Wandering.';

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
}