import {b3} from '../index';
import * as Core from '../core';
import {util} from '../../util';
import {IItemState} from '../../entity/components';

export class CraftItem extends Core.BaseNode {
	item: string;
	destinationTileBlackboardKey: string;
	craftTurns: number;
	craftTurnsTotal: number;

	constructor (
        item: string,
		craftTurns: number,
        destinationTileBlackboardKey: string
    ) {
		super();
		this.item = item;
		this.destinationTileBlackboardKey = destinationTileBlackboardKey;

		this.craftTurns = 0;
		this.craftTurnsTotal = craftTurns;
		if (!this.craftTurnsTotal) {
			debugger;
		}
	}
	tick (tick: Core.Tick) {
		this.craftTurns++;

		if (this.craftTurns >= this.craftTurnsTotal) {
			const destinationTile = util.blackboardGet(
				tick,
				this.destinationTileBlackboardKey
			);
			// itemManager.spawn(this.item.name, destinationTile, {
			// 	claimed: true
			// });
            console.log('spawn item', this.item, destinationTile);
			return b3.SUCCESS;
		}
		return b3.RUNNING;
	}
}