import * as _ from 'lodash';
import {b3} from '../index';
import * as Core from '../Core';
import {IRowColumnCoordinates} from '../../interfaces';
import {storageUtil} from '../../entity/util/storage';
import {shopUtil} from '../../entity/util/shop';

type SetStorageIdFunction = (storageId: number) => void;

export class GetStorageLocation extends Core.BaseNode {
    item: number;
    startTile: IRowColumnCoordinates;
    setStorageIdFunction: SetStorageIdFunction;
    shop: boolean;

	constructor (
        item: number,
        startTile: IRowColumnCoordinates,
        setStorageIdFunction: SetStorageIdFunction,
        shop: boolean
    ) {
		super();
        this.item = item;
        this.startTile = startTile;
        this.setStorageIdFunction = setStorageIdFunction;
        this.shop = shop;
	}
	tick (tick: Core.Tick) {
        const util = this.shop ? shopUtil : storageUtil;
        const nearest = util.getNearestStorageEntityToTile(
            this.item,
            this.startTile
        );

        if (!_.isNumber(nearest)) {
            return b3.FAILURE;
        }

        this.setStorageIdFunction(nearest);
		return b3.SUCCESS;
	}
}