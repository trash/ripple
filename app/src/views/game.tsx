import React = require('react');
import {DebugPanel} from './components/debug-panel';

export class GameComponent extends React.Component<any, any> {
    render () {
        return (
            <DebugPanel/>
        );
    }
}