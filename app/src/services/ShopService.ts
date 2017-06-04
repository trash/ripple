import * as _ from 'lodash';
import * as Immutable from 'immutable';
import {Item} from '../data/Item';
import {ShopItemEntry, ShopItemMap} from '../interfaces';
import {dataList as itemList, assemblageData} from '../entity/assemblageData/items';
import {taskQueueManager} from '../Tasks/TaskQueueManager';
import {store} from '../redux/store';
import {updateItemToBeSold} from '../redux/actions';

export class ShopService {
    private itemMap: ShopItemMap;

    constructor() {
        this.itemMap = Immutable.Map<Item, ShopItemEntry>();
        itemList.forEach(entry => this.updateToBeSoldCount(entry.item.enum, 0));
        this.updateStore();
    }

    private updateStore(): void {
        store.dispatch(updateItemToBeSold(this.itemMap));
    }

    private getItemEntry(item: Item): ShopItemEntry {
        let shopItemEntry = this.itemMap.get(item);
        if (!shopItemEntry) {
            shopItemEntry = {
                toBeSold: 0
            };
            this.itemMap = this.itemMap.set(item, shopItemEntry);
        }
        return _.clone(shopItemEntry);
    }

    updateToBeSoldCount(item: Item, count: number): ShopItemMap {
        const craftableItemEntry = this.getItemEntry(item);
        const currentCount = craftableItemEntry.toBeSold;
        craftableItemEntry.toBeSold = count;
        this.itemMap = this.itemMap.set(item, craftableItemEntry);

        const diff = count - currentCount;
        for (let i = 0; i < diff; i++) {
            console.info('new item to be sold', Item[item]);
        }

        this.updateStore();

        return this.itemMap;
    }
}

export const shopService = new ShopService();