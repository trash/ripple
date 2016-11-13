import React = require('react');
import {store} from '../../redux/store';

export class DebugPanel extends React.Component<any, any> {
    componentWillMount () {
        store.subscribe(() => {
            console.log(store.getState().tile);
        });
    }

    render () {
        return (
        <div>
            <h1>Debug</h1>
        </div>
        );
    }
}