import {connect} from 'react-redux';
import {StoreState} from '../../redux/store';
import * as React from 'react';
import {itemUtil} from '../../entity/util/item';

export interface ItemListProps {
    itemList: Immutable.Map<string, number>;
}

export class ItemList extends React.Component<ItemListProps, void> {
    render () {
        return (
            <ul className="item-list">
                {this.props.itemList.entrySeq().map(([itemName, count]) => {
                    return <li key={itemName}>
                        <img src={itemUtil.getImagePath(itemName)}/>
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