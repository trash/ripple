import React = require('react');
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {showBuildingsList, showDebugBar} from '../../redux/actions';
import {BuildingsList} from './BuildingsList';
import {DebugBar} from './DebugBar';

interface ActionBarProps {
    buildingsListShown: boolean;
    debugBarShown: boolean;
}

export class ActionBar extends React.Component<ActionBarProps, null> {
    render () {
        return (
        <div className="action-bar">
            <div className="action-bar-upper">
                { this.props.buildingsListShown &&
                <BuildingsList/>}
                { this.props.debugBarShown &&
                <DebugBar/>}
            </div>
            <div className="action-bar-buttons">
                <button onClick={ () => store.dispatch(
                    showBuildingsList(!this.props.buildingsListShown)) }
                >Buildings</button>
                <button onClick={ () => store.dispatch(
                    showDebugBar(!this.props.debugBarShown)
                ) }>Debug</button>
            </div>
        </div>
        );
    }
}

export const ConnectedActionBar = connect((state: StoreState) => {
    return {
        buildingsListShown: state.buildingsListShown,
        debugBarShown: state.debugBarShown
    };
})(ActionBar);