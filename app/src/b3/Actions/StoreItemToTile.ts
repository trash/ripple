import {b3} from '../index';
import {util} from '../../util';
import * as Core from '../Core';
import {IRowColumnCoordinates} from '../../interfaces';
import {storageUtil, inventoryUtil} from '../../entity/util';

export class StoreItemToTile extends Core.BaseNode {
	item: number;
    storage: () => number;

	constructor (
        item: number,
        storage: () => number
    ) {
		super();
        this.item = item;
        this.storage = storage;
	}

	tick (tick: Core.Tick) {
        storageUtil.storeItem(this.item, this.storage());
        inventoryUtil.remove(tick.target.id, this.item);

		return b3.SUCCESS;
	}
}