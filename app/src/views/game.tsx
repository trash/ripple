import React = require('react');
import {Provider} from 'react-redux';
import {ConnectedDebugPanel} from './components/debugPanel';
import {ConnectedActionBar} from './components/actionBar';
import {store} from '../redux/store';

export class InnerGameComponent extends React.Component<null, null> {
    render() {
        return (
        <div className="game-ui">
            <div className="top-section">
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