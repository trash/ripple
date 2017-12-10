import * as Immutable from 'immutable';
import * as React from 'react'
import {Provider, connect} from 'react-redux';
import {store, StoreState} from '../redux/store';
import {Tabs, Tab} from 'react-bootstrap';

import {ConnectedCollisionDebugView} from './components/CollisionDebugView';
import {ConnectedDebugPanel} from './components/DebugPanel';
import {ConnectedAgentList} from './components/AgentList';
import {ConnectedBuildingList} from './components/BuildingList';
import {ConnectedVillagerList} from './components/VillagerList';
import {ConnectedItemList} from './components/ItemList';
import {ConnectedActionBar} from './components/ActionBar';
import {ConnectedClock} from './components/Clock';
import {ConnectedItemCountBar} from './components/ItemCountBar';
import {ConnectedEconomyView} from './components/EconomyView';

export const InnerGameComponent = () =>
    <div className="game-ui">
        <div className="top-section">
            <ConnectedItemCountBar/>
            <ConnectedClock/>
        </div>
        <div className="middle-section">
            <div className="left-menu">
                <Tabs className="left-menu-tabs"
                    id="left-menu-tabs"
                    defaultActiveKey={1}>
                    <Tab eventKey={1} title="Debug">
                        <ConnectedDebugPanel/>
                    </Tab>
                    <Tab eventKey={2} title="Agents">
                        <ConnectedAgentList/>
                    </Tab>
                    <Tab eventKey={3} title="Villagers">
                        <ConnectedVillagerList/>
                    </Tab>
                    <Tab eventKey={4} title="Buildings">
                        <ConnectedBuildingList/>
                    </Tab>
                    <Tab eventKey={5} title="Items">
                        <ConnectedItemList/>
                    </Tab>
                    <Tab eventKey={6} title="Economy">
                        <ConnectedEconomyView/>
                    </Tab>
                </Tabs>
            </div>
        </div>
        <ConnectedActionBar/>
        <ConnectedCollisionDebugView/>
    </div>

export class GameComponent extends React.Component<any, any> {
    render () {
        return (
            <Provider store={store}>
                {InnerGameComponent()}
            </Provider>
        );
    }
}