import * as Core from '../../Core';
import * as Actions from '../../Actions';
import {IRowColumnCoordinates} from '../../../interfaces';
import {itemUtil} from '../../../entity/util/item';
import {positionUtil} from '../../../entity/util/position';

const targetKey = 'hauler-task-target';

export class HaulerTask extends Core.MemSequence {
	constructor (
		item: number,
		shop = false
	) {
		let storage: number;
		super({
			children: [
				new Actions.SetBlackboardValue(targetKey, () =>
					itemUtil.getItemSearchResultFromItem(item)),
				new Actions.GoToTarget(() => positionUtil.getTileFromEntityId(item)),
				new Actions.PickupItem(targetKey),
				new Actions.GetStorageLocation(
					item,
					positionUtil.getTileFromEntityId(item),
					storageId => storage = storageId,
					shop
				),
				new Actions.GoToTarget(() => positionUtil.getTileFromEntityId(storage)),
				new Actions.StoreItemToTile(item, () => storage, shop)
			]
		});
	}
}