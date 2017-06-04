import * as _ from 'lodash';
import * as Immutable from 'immutable';
import {Item} from '../data/Item';
import {CraftableItemEntry, CraftableItemMap} from '../interfaces';
import {dataList as itemList, assemblageData} from '../entity/assemblageData/items';
import {taskQueueManager} from '../Tasks/TaskQueueManager';
import {store} from '../redux/store';
import {updateCraftableQueued} from '../redux/actions';

export class CraftableService {
    private itemMap: CraftableItemMap;

    constructor() {
        this.itemMap = Immutable.Map<Item, CraftableItemEntry>();
        itemList.forEach(entry => {
            if (entry.craftable) {
                this.updateQueueCount(entry.item.enum, 0);
            }
        });
        this.updateStore();
    }

    private updateStore(): void {
        store.dispatch(updateCraftableQueued(this.itemMap));
    }

    private getItemEntry(item: Item): CraftableItemEntry {
        let craftableItemEntry = this.itemMap.get(item);
        if (!craftableItemEntry) {
            craftableItemEntry = {
                queued: 0
            };
            this.itemMap = this.itemMap.set(item, craftableItemEntry);
        }
        return _.clone(craftableItemEntry);
    }

    updateQueueCount(item: Item, count: number): CraftableItemMap {
        const craftableItemEntry = this.getItemEntry(item);
        const currentCount = craftableItemEntry.queued;
        craftableItemEntry.queued = count;
        this.itemMap = this.itemMap.set(item, craftableItemEntry);

        const diff = count - currentCount;
        for (let i = 0; i < diff; i++) {
            console.info('queue up task');
            const profession = assemblageData[item].craftable.profession;
            const taskQueue = taskQueueManager.professionTaskQueue(profession);
            taskQueue.push(item);
        }
        if (diff < 0) {
            console.info('Need to implement cancelling queued up craft tasks');
        }

        this.updateStore();

        return this.itemMap;
    }
}

export const craftableService = new CraftableService();