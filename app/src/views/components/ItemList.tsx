import * as Immutable from 'immutable';
import {connect} from 'react-redux';
import {StoreState} from '../../redux/store';
import * as React from 'react';
import {itemUtil} from '../../entity/util/item';
import {Item} from '../../data/Item';

export interface ItemListProps {
    itemList: Immutable.Map<Item, number>;
}

export class ItemList extends React.Component<ItemListProps, void> {
    render () {
        return (
            <ul className="item-list">
                {this.props.itemList.entrySeq().map(([item, count]) => {
                    return <li key={item}>
                        <img src={itemUtil.getImagePath(item)}/>
                        {count}
                    </li>
                })}
            </ul>
        );
    }
}

export const ConnectedItemList = connect((state: StoreState) => {
    return {
        itemList: state.items
    };
})(ItemList);