import {BaseUtil} from './base';
import {IInventoryState} from '../components/inventory';

export class InventoryUtil extends BaseUtil {
    add (inventoryState: IInventoryState, id: number) {
        inventoryState.items.push(id);
    }
    remove (
        inventoryState: IInventoryState,
        item: number
    ): number[] {
		const index = inventoryState.items.indexOf(item);
		if (index === -1) {
			console.error('nice job broh');
			debugger;
		}
		return inventoryState.items.splice(index, 1);
	}
}

export const inventoryUtil = new InventoryUtil();