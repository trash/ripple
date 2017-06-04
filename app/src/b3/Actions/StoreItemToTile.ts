import {b3} from '../index';
import {util} from '../../util';
import * as Core from '../Core';
import {IRowColumnCoordinates} from '../../interfaces';
import {storageUtil, inventoryUtil, shopUtil} from '../../entity/util';

export class StoreItemToTile extends Core.BaseNode {
	item: number;
    storage: () => number;
    shop: boolean;

	constructor (
        item: number,
        storage: () => number,
        shop: boolean
    ) {
		super();
        this.item = item;
        this.storage = storage;
        this.shop = shop;
	}

	tick (tick: Core.Tick) {
        const util = this.shop ? shopUtil : storageUtil;
        util.storeItem(this.item, this.storage());
        inventoryUtil.remove(tick.target.id, this.item);

		return b3.SUCCESS;
	}
}