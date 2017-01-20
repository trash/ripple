import {MemSequence} from '../../core/mem-sequence';
// import {GoToTarget} from '../go-to-target';
// import {PickupItem} from '../pickup-item';
// import {StoreItemToTile} from '../store-item-to-tile';
// import {SetBlackboardValue} from '../set-blackboard-value';
// import {HaulerTask as Task} from '../../../core/tasks/hauler-task';
import {MapTile} from '../../../map/tile';
// import {Item} from '../../../core/items/item';

const targetKey = 'hauler-task-target';

export class HaulerTask extends MemSequence {
	constructor (
		item: number,
		dropOffLocation: MapTile
	) {
		if (!item || !dropOffLocation) {
			console.error('broken hauler task created');
			debugger;
		}
		super({
			children: [
				// new SetBlackboardValue(targetKey, item),
				// new GoToTarget(targetKey),
				// new PickupItem(targetKey),
				// new GoToTarget(() => dropOffLocation),
				// new StoreItemToTile(targetKey, dropOffLocation),
			]
		});
	}
}