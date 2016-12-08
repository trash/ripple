import React = require('react');
import {Provider} from 'react-redux';
import {DebugPanel, ConnectedDebugPanel} from './components/debug-panel';
import {store} from '../redux/store';

export class GameComponent extends React.Component<any, any> {
    render () {
        return (
            <Provider store={store}>
                <ConnectedDebugPanel/>
            </Provider>
        );
    }
}