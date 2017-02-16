import {BaseUtil} from './base';
import {IInventoryState} from '../components/inventory';

export class InventoryUtil extends BaseUtil {
    add (
        inventory: number,
        item: number
    ) {
        const inventoryState = this._getInventoryState(inventory);
        inventoryState.items.push(item);
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

    contains(
        inventoryState: IInventoryState,
        item: number
    ): boolean {
        return inventoryState.items.includes(item);
    }

    removeGold(
        inventory: number,
        amount?: number
    ): number {
        const inventoryState = this._getInventoryState(inventory);

        if (!amount) {
            amount = inventoryState.gold;
        }
        inventoryState.gold -= amount;
        return amount;
    }
}

export const inventoryUtil = new InventoryUtil();