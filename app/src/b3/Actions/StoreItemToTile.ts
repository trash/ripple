import {b3} from '../index';
import {util} from '../../util';
import * as Core from '../Core';
import {IRowColumnCoordinates} from '../../interfaces';
import {storageUtil} from '../../entity/util/storage';

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

	tick () {
        storageUtil.storeItem(this.item, this.storage());

		return b3.SUCCESS;
	}
}