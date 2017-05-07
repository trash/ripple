import * as React from 'react';
import {taskQueueManager} from '../../Tasks/TaskQueueManager';
import {Profession} from '../../data/Profession';
import {Item} from '../../data/Item';
import {dataList as itemList} from '../../entity/assemblageData/items';

const createCraftTask = (item: Item, profession: Profession) => {
    const taskQueue = taskQueueManager.professionTaskQueue(profession);
    taskQueue.push(item);
}

export const CraftBar = () =>
    <div className="action-bar-buttons">
    {itemList.filter(item => !!item.craftable).map(item => {
        const itemName = item.item.name;
        return (
        <button key={itemName}
            onClick={() => createCraftTask(item.item.enum, item.craftable.profession)}
        >{itemName}</button>
        );
    })}
    </div>