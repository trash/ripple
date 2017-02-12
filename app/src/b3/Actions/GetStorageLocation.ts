import * as _ from 'lodash';
import {b3} from '../index';
import * as Core from '../Core';
import {IRowColumnCoordinates} from '../../interfaces';
import {storageUtil} from '../../entity/util/storage';

type SetStorageIdFunction = (storageId: number) => void;

export class GetStorageLocation extends Core.BaseNode {
    item: number;
    startTile: IRowColumnCoordinates;
    setStorageIdFunction: SetStorageIdFunction;

	constructor (
        item: number,
        startTile: IRowColumnCoordinates,
        setStorageIdFunction: SetStorageIdFunction
    ) {
		super();
        this.item = item;
        this.startTile = startTile;
        this.setStorageIdFunction = setStorageIdFunction;
	}
	tick (tick: Core.Tick) {
        const nearest = storageUtil.getNearestStorageEntityToTile(
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