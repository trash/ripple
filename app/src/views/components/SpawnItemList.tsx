import * as React from 'react';
import {connect} from 'react-redux';

import {store, StoreState} from '../../redux/store';
import {events} from '../../events';
import {dataList as itemList} from '../../entity/assemblageData/items';
import {itemUtil} from '../../entity/util/item';

interface SpawnItemListProps {
    turn: number;
}

export const SpawnItemList = (props: SpawnItemListProps) =>
    <ul className="item-list">
    { itemList.map(itemData => {
        const item = itemData.item.enum;
        return (
        <li key={item}
            onClick={() => events.emit('spawnItem', item, props.turn)}>
            <img src={itemUtil.getImagePath(item)}/>
            <p>{itemData.item.readableName}</p>
        </li>
        );
    })}
    </ul>;

export const ConnectedSpawnItemList = connect((state: StoreState) => {
    return {
        turn: state.gameTurn
    };
})(SpawnItemList);