import * as Immutable from 'immutable';
import React = require('react');
import {Provider, connect} from 'react-redux';
import {store, StoreState} from '../redux/store';

import {ConnectedDebugPanel} from './components/debugPanel';
import {ConnectedActionBar} from './components/actionBar';
import {ConnectedClock} from './components/Clock';

export interface ItemListProps {
    itemList: Immutable.Map<string, number>;
}

export class ItemList extends React.Component<ItemListProps, void> {
    render () {
        return (
            <ul className="item-list">
                {this.props.itemList.entrySeq().map(([itemName, count]) => {
                    return <li key={itemName}>{`${itemName}:${count}`}</li>
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

export class InnerGameComponent extends React.Component<null, null> {
    render() {
        return (
        <div className="game-ui">
            <div className="top-section">
                <ConnectedItemList/>
                <ConnectedClock/>
            </div>
            <div className="middle-section">
                <ConnectedDebugPanel/>
            </div>
            <ConnectedActionBar/>
        </div>
        );
    }
}

export class GameComponent extends React.Component<any, any> {
    render () {
        return (
            <Provider store={store}>
                <InnerGameComponent/>
            </Provider>
        );
    }
}