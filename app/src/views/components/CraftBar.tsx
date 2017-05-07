import * as React from 'react';
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {updateCraftableQueued} from '../../redux/actions';
import {Profession} from '../../data/Profession';
import {Item} from '../../data/Item';
import {CraftableItemMap} from '../../interfaces';
import {dataList as itemList} from '../../entity/assemblageData/items';

interface CraftBarProps {
    craftableItemMap: CraftableItemMap;
}

export const CraftBar = (props: CraftBarProps) => {
    return (
    <div className="action-bar-buttons">
        {itemList.filter(item => !!item.craftable).map(item => {
            const itemName = item.item.name;
            const count = props.craftableItemMap.get(item.item.enum).queued;
            return (
            <button key={itemName}
                onClick={() => store.dispatch(updateCraftableQueued(item.item.enum, count + 1))}
            >{`${itemName} (${count})`}</button>
            );
        })}
    </div>
    );
}

export const ConnectedCraftBar = connect((state: StoreState) => {
    return {
        craftableItemMap: state.craftableItemMap
    };
})(CraftBar);