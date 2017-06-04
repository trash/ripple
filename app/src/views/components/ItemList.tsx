import * as Immutable from 'immutable';
import {connect} from 'react-redux';
import * as React from 'react';
import {StoreState} from '../../redux/store';
import {updateCraftableQueued} from '../../redux/actions';
import {CraftableItemMap, ShopItemMap} from '../../interfaces';
import {IItemState} from '../../entity/components';
import {Item} from '../../data/Item';
import {itemUtil} from '../../entity/util';
import {dataList as itemList, assemblageData} from '../../entity/assemblageData/items';
import {craftableService} from '../../services/CraftableService';
import {shopService} from '../../services/ShopService';
import {EntityList} from './EntityList';
import {AutoUpdate} from '../higherOrder/AutoUpdate';

interface ItemListProps {
    itemList: Immutable.Map<Item, number>;
    claimedItemList: Immutable.Map<Item, number>;
    craftableItemMap: CraftableItemMap;
    shopItemMap: ShopItemMap;
}

export class ItemListComponent extends React.Component<ItemListProps, void> {
    render() {
        return (
        <EntityList
            topContent={[
                <div key="no" className="entity-list-header">
                    <div className="type-column">Item</div>
                    <div className="sprite-column"/>
                    <div className="count-column">Queued</div>
                    <div className="count-column">For Sale</div>
                    <div className="count-column">Count</div>
                </div>,
                ...itemList.map(entry => {
                    const item = entry.item.enum;
                    const count = this.props.claimedItemList.get(item) || 0;
                    const craftableEntry = this.props.craftableItemMap.get(item);
                    const shopEntry = this.props.shopItemMap.get(item);
                    const queueable = !!craftableEntry;
                    return (
                        <div className="entity-list-entry"
                            key={item}>
                            <div className="type-column">{entry.item.readableName}</div>
                            <div className="sprite-column">
                                <img src={itemUtil.getImagePath(item)}/>
                            </div>
                            <div className="count-column">
                                {queueable
                                    ? <input type="number"
                                        value={craftableEntry.queued}
                                        onChange={e => craftableService.updateQueueCount(item, parseInt(e.target.value))}/>
                                    : '-'
                                }
                            </div>
                            <div className="count-column">
                                <input type="number"
                                    value={shopEntry.toBeSold}
                                    onChange={e => shopService.updateToBeSoldCount(item, parseInt(e.target.value))}/>
                            </div>
                            <div className="count-column">{count}</div>
                        </div>
                    );
                })
            ]}
        />
        );
    }
}

const ItemList = AutoUpdate(ItemListComponent, 1000);

export const ConnectedItemList = connect((state: StoreState) => {
    return {
        itemList: state.items,
        claimedItemList: state.claimedItems,
        craftableItemMap: state.craftableItemMap,
        shopItemMap: state.shopItemMap
    };
})(ItemList);