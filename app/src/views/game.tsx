import * as Immutable from 'immutable';
import * as React from 'react'
import {Provider, connect} from 'react-redux';
import {store, StoreState} from '../redux/store';
import {Tabs, Tab} from 'react-bootstrap';

import {ConnectedCollisionDebugView} from './components/CollisionDebugView';
import {ConnectedDebugPanel} from './components/DebugPanel';
import {ConnectedAgentList} from './components/AgentList';
import {ConnectedVillagerList} from './components/VillagerList';
import {ConnectedActionBar} from './components/ActionBar';
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
                        <Tab eventKey={3} title="Villager List">
                            <ConnectedVillagerList/>
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <ConnectedActionBar/>
            <ConnectedCollisionDebugView/>
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