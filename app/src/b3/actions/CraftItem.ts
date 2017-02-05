import {b3} from '../index';
import * as Core from '../core';
import {util} from '../../util';
import {IItemState} from '../../entity/components';
import {IRowColumnCoordinates} from '../../interfaces';

type DestinationTileFunction = (tick: Core.Tick) => IRowColumnCoordinates;

export class CraftItem extends Core.BaseNode {
	item: string;
	craftTurns: number;
	craftTurnsTotal: number;
	destinationTileFunction: DestinationTileFunction;

	constructor (
        item: string,
		craftTurns: number,
		destinationTileFunction: DestinationTileFunction
    ) {
		super();
		this.item = item;
		this.destinationTileFunction = destinationTileFunction;

		this.craftTurns = 0;
		this.craftTurnsTotal = craftTurns;
		if (!this.craftTurnsTotal) {
			debugger;
		}
	}
	tick (tick: Core.Tick) {
		this.craftTurns++;

		if (this.craftTurns >= this.craftTurnsTotal) {
			const destinationTile = this.destinationTileFunction(tick);
			tick.target.entitySpawner.spawnItem(this.item, {
				position: {
					tile: destinationTile
				},
				item: {
					claimed: true
				}
			});
			return b3.SUCCESS;
		}
		return b3.RUNNING;
	}
}