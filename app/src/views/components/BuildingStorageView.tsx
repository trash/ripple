import * as React from 'react';

import {storageUtil} from '../../entity/util';

import {
    IStorageState,
    IShopState
} from '../../entity/components';

interface BuildingStorageViewProps {
    storage: IStorageState;
    shop: IShopState;
}

export class BuildingStorageView extends React.Component<BuildingStorageViewProps, object> {
    render() {
        return (
        <div>
            {this.props.storage && this.props.storage.total > 0 &&
            <div>
                <h5>Storage</h5>
                <div>
                    <div>Capacity</div>
                    <div>{storageUtil.availableStorageToString(this.props.storage)}</div>
                </div>
                <div>
                    <div>Items</div>
                    <div>{storageUtil.storageItemListToString(this.props.storage)}</div>
                </div>
                <div>
                    <div>Item Restrictions</div>
                    <div>{storageUtil.storageRestrictionsToString(this.props.storage)}</div>
                </div>
            </div>
            }
            {this.props.shop && this.props.shop.total > 0 &&
            <div>
                <h5>Shop</h5>
                <div>
                    <div>Capacity</div>
                    <div>{storageUtil.availableStorageToString(this.props.shop)}</div>
                </div>
                <div>
                    <div>Items</div>
                    <div>{storageUtil.storageItemListToString(this.props.shop)}</div>
                </div>
                <div>
                    <div>Item Restrictions</div>
                    <div>{storageUtil.storageRestrictionsToString(this.props.shop)}</div>
                </div>
            </div>
            }
        </div>
        );
    }
}