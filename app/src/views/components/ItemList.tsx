import * as Immutable from 'immutable';
import {connect} from 'react-redux';
import {StoreState} from '../../redux/store';
import * as React from 'react';
import {itemUtil} from '../../entity/util';
import {Item} from '../../data/Item';

export interface ItemListProps {
    itemList: Immutable.Map<Item, number>;
    claimedItemList: Immutable.Map<Item, number>;
    gold: number;
}

export class ItemList extends React.Component<ItemListProps, void> {
    render () {
        return (
            <ul className="item-list">
                <li key="gold">
                    <img src={itemUtil.getImagePath(Item.Gold)}/>
                    {this.props.gold}
                </li>
                {this.props.itemList.entrySeq().map(([item, count]) => {
                    const claimedCount = this.props.claimedItemList.get(item);
                    return <li key={item}>
                        <img src={itemUtil.getImagePath(item)}/>
                        {`${count} (${claimedCount})`}
                    </li>
                })}
            </ul>
        );
    }
}

export const ConnectedItemList = connect((state: StoreState) => {
    return {
        itemList: state.items,
        claimedItemList: state.claimedItems,
        gold: state.gold
    };
})(ItemList);