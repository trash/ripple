import * as Immutable from 'immutable';
import {connect} from 'react-redux';
import * as React from 'react';
import {store, StoreState} from '../../redux/store';
// import {buildingListSelect} from '../../redux/actions';
import {IItemState} from '../../entity/components';
import {Item} from '../../data/Item';
import {itemUtil} from '../../entity/util';
import {assemblageData} from '../../entity/assemblageData/items';

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
                    <div className="type-column">Item</div>
                    <div className="sprite-column"/>
                    <div className="count-column">Count</div>
                </div>
                {this.props.claimedItemList.entrySeq().map(([item, count]) => {
                    return (
                        <div className="agent-list-entry"
                            key={item}>
                            <div className="type-column">{assemblageData[item].item.readableName}</div>
                            <div className="sprite-column">
                                <img src={itemUtil.getImagePath(item)}/>
                            </div>
                            <div className="count-column">{count}</div>
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