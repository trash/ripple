import * as Core from '../../Core';
import {MapTile} from '../../../map/tile';

const targetKey = 'hauler-task-target';

export class HaulerTask extends Core.MemSequence {
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