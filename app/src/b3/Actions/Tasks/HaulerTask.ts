import * as Core from '../../Core';
import * as Actions from '../../Actions';
import {IRowColumnCoordinates} from '../../../interfaces';
import {positionUtil} from '../../../entity/util/position';

const targetKey = 'hauler-task-target';

export class HaulerTask extends Core.MemSequence {
	constructor (
		item: number
	) {
		let storage: number;
		super({
			children: [
				new Actions.SetBlackboardValue(targetKey, () => {
					return {
						id: item,
						state: positionUtil._getItemState(item),
						position: positionUtil._getPositionState(item)
					};
				}),
				new Actions.GoToTarget(() => positionUtil.getTileFromEntityId(item)),
				new Actions.PickupItem(targetKey),
				new Actions.GetStorageLocation(
					positionUtil.getTileFromEntityId(item),
					storageId => storage = storageId),
				new Actions.GoToTarget(() => positionUtil.getTileFromEntityId(storage)),
				new Actions.StoreItemToTile(item, () => storage)
			]
		});
	}
}