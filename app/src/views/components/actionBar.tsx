import React = require('react');
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';

interface ActionBarProps {

}

interface ActionBarState {

}

const dummyActionButtons = ['button1', 'button2', 'button3'];

export class ActionBar extends React.Component<ActionBarProps, ActionBarState> {
    render () {
        console.info('ya dat action bar');

        return (
        <div className="action-bar">
        { dummyActionButtons.map(button =>
            <button onClick={() => console.log(button)}>{button}</button>
        ) }
        </div>
        );
    }
}

export const ConnectedActionBar = connect((state: StoreState) => {
    return {
    };
})(ActionBar);