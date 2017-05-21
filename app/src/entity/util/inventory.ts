import {BaseUtil} from './base';
import {itemUtil} from './item';
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
        inventory: number,
        item: number
    ): number[] {
        const inventoryState = this._getInventoryState(inventory);
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

    getItems(inventory: number): number[] {
        return this._getInventoryState(inventory).items;
    }

    itemListToString(inventoryState: IInventoryState): string {
        return itemUtil.itemListToString(inventoryState.items);
    }
}

export const inventoryUtil = new InventoryUtil();