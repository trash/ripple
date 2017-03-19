import * as Immutable from 'immutable';
import * as React from 'react'
import {Provider, connect} from 'react-redux';
import {store, StoreState} from '../redux/store';
import {Tabs, Tab} from 'react-bootstrap';

import {ConnectedDebugPanel} from './components/debugPanel';
import {ConnectedAgentList} from './components/AgentsList';
import {ConnectedActionBar} from './components/actionBar';
import {ConnectedClock} from './components/Clock';
import {ConnectedItemList} from './components/ItemList';

export class InnerGameComponent extends React.Component<void, void> {
    render() {
        return (
        <div className="game-ui">
            <div className="top-section">
                <ConnectedItemList/>
                <ConnectedClock/>
            </div>
            <div className="middle-section">
                <div className="left-menu">
                    <Tabs className="left-menu-tabs"
                        id="left-menu-tabs"
                        defaultActiveKey={1}>
                        <Tab eventKey={1} title="Debug Menu">
                            <ConnectedDebugPanel/>
                        </Tab>
                        <Tab eventKey={2} title="Agent List">
                            <ConnectedAgentList/>
                        </Tab>
                    </Tabs>
                </div>
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