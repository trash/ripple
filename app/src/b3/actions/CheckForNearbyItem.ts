import {b3} from '../index';
import * as Core from '../Core';
import {IItemSearchOptions} from '../../interfaces';
import {util} from '../../util';
import {itemUtil} from '../../entity/util/item';
import {MapUtil} from '../../map/map-util';

export class CheckForNearbyItem extends Core.BaseNode {
	targetKey: string;
	searchOptions: IItemSearchOptions;
	distance: number;
	cancelItemsToBeStored: boolean;

	constructor (
		targetKey: string,
		searchOptions: IItemSearchOptions,
		distance?: number,
		cancelItemsToBeStored: boolean = false
	) {
		super();
		this.targetKey = targetKey;
		this.searchOptions = searchOptions;
		this.distance = distance;
		this.cancelItemsToBeStored = cancelItemsToBeStored;
	}
	tick (tick: Core.Tick) {
        const agentTile = tick.target.position.tile;
        const target = itemUtil.getNearestItem(
            agentTile,
            this.searchOptions,
            this.cancelItemsToBeStored
        );

		// No match or the closest match is out of range
		// NOTE: distance should be optional
		if (!target || (this.distance
                && MapUtil.distanceTo(agentTile, target.position.tile) > this.distance)
        ) {
			return b3.FAILURE;
		}
		util.blackboardSet(tick, this.targetKey, target);
		return b3.SUCCESS;
	}
}
