import * as Immutable from 'immutable';
import {connect} from 'react-redux';
import * as React from 'react';
import {store, StoreState} from '../../redux/store';
// import {buildingListSelect} from '../../redux/actions';
import {IItemState} from '../../entity/components';
import {Item} from '../../data/Item';
import {itemUtil} from '../../entity/util';

interface ItemListProps {
    itemList: Immutable.Map<Item, number>;
    claimedItemList: Immutable.Map<Item, number>;
}

export class ItemList extends React.Component<ItemListProps, void> {
    render() {
        return (
        <div className="agent-list-container">
            <div className="agent-list">
                <div className="agent-list-header">
                    <div></div>
                    <div></div>
                    <div>Count</div>
                </div>
                {this.props.itemList.entrySeq().map(([item, count]) => {
                    return (
                        <div className="agent-list-entry"
                            key={item}>
                            <div>{Item[item]}</div>
                            <div>
                                <img src={itemUtil.getImagePath(item)}/>
                            </div>
                            <div>{count}</div>
                        </div>
                    );
                })}
            </div>
        </div>
        );
    }
}

export const ConnectedItemList = connect((state: StoreState) => {
    return {
        itemList: state.items,
        claimedItemList: state.claimedItems
    };
})(ItemList);