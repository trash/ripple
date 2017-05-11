import * as React from 'react';

import {storageUtil} from '../../entity/util';

import {
    IStorageState
} from '../../entity/components';

interface BuildingStorageViewProps {
    storage: IStorageState;
}

export class BuildingStorageView extends React.Component<BuildingStorageViewProps, void> {
    render() {
        console.info('work on integrating functionality to choose what is stored/sold here');
        return (
        <div>
            <div>
                <div>Items</div>
                <div>{storageUtil.storageItemListToString(this.props.storage)}</div>
            </div>
            <div>
                <div>Storage Restrictions</div>
                <div>{storageUtil.storageRestrictionsToString(this.props.storage)}</div>
            </div>
        </div>
        );
    }
}