import * as _ from 'lodash';
import * as Immutable from 'immutable';
import {events} from '../events';
import {Item} from '../data/Item';
import {Profession} from '../data/Profession';
import {ShopItemEntry, ShopItemMap} from '../interfaces';
import {dataList as itemList, assemblageData} from '../entity/assemblageData/items';
import {taskQueueManager} from '../Tasks/TaskQueueManager';
import {store} from '../redux/store';
import {updateItemToBeSold} from '../redux/actions';
import {itemUtil} from '../entity/util/item';
import {buildingUtil} from '../entity/util/building';

export class ShopService {
    private itemMap: ShopItemMap;

    constructor() {
        this.itemMap = Immutable.Map<Item, ShopItemEntry>();
        itemList.forEach(entry => this.updateToBeSoldCount(entry.item.enum, 0));
        this.updateStore();
        _.defer(() => events.emit('shopService', this));
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

    /**
     * Queues up an item of the given type to be sold.
     *
     * Returns false if it's impossible due to no building existing with space
     * or no item existing that matches.
     * @param item
     */
    queueUpItemToBeSold(item: Item): boolean {
        console.info('new item to be sold', Item[item]);

        // 1) Check if there is a shop with available space to stock the item
        const building = buildingUtil.getShopWithSpaceAvailable();
        if (!building) {
            console.log('no shop found to stock');
            return false;
        }
        const buildingTile = buildingUtil.getTileFromBuilding(building);
        // 2) Check that there are available items to be put up for sale
        const nearest = itemUtil.getNearestItem(buildingTile, {
            claimed: true,
            toBeStored: false,
            forSale: false,
            stored: false,
            itemEnums: [item]
        });
        if (!nearest) {
            console.log('no item found to sell');
            return false;
        }
        // 3) Select an available item and create a task to haul it to the
        // shop
        console.info('create hauler task');
        const taskQueue = taskQueueManager.professionTaskQueue(Profession.Hauler);
        taskQueue.push([nearest.id, building]);

        // 4) Mark it as for sale
        nearest.state.forSale = true;
        return true;
    }

    updateToBeSoldCount(item: Item, count: number): ShopItemMap {
        const craftableItemEntry = this.getItemEntry(item);
        const currentCount = craftableItemEntry.toBeSold;
        craftableItemEntry.toBeSold = count;
        this.itemMap = this.itemMap.set(item, craftableItemEntry);

        const diff = count - currentCount;
        for (let i = 0; i < diff; i++) {
            if (!this.queueUpItemToBeSold(item)) {
                break;
            }
        }

        this.updateStore();

        return this.itemMap;
    }
}

export const shopService = new ShopService();