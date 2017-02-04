import * as Immutable from 'immutable';
import * as React from 'react'
import {Provider, connect} from 'react-redux';
import {store, StoreState} from '../redux/store';

import {ConnectedDebugPanel} from './components/debugPanel';
import {ConnectedActionBar} from './components/actionBar';
import {ConnectedClock} from './components/Clock';
import {ConnectedItemList} from './components/ItemList';


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