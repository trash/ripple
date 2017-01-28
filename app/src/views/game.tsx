import React = require('react');
import {Provider, connect} from 'react-redux';
import {ConnectedDebugPanel} from './components/debugPanel';
import {ConnectedActionBar} from './components/actionBar';
import {store, StoreState} from '../redux/store';

export interface ClockProps {
    hours: number;
    days: number;
}

export class Clock extends React.Component<ClockProps, void> {
    render () {
        return (
            <div className="clock">
                Day: {this.props.days} Hour: {this.props.hours}
            </div>
        );
    }
}

export const ConnectedClock = connect((state: StoreState) => {
    return {
        days: state.days,
        hours: state.hours
    };
})(Clock);

export class InnerGameComponent extends React.Component<null, null> {
    render() {
        return (
        <div className="game-ui">
            <div className="top-section">
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