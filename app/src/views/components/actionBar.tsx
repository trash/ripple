import React = require('react');
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {showBuildingsList} from '../../redux/actions';
import {BuildingsList} from './BuildingsList';

interface ActionBarProps {
    buildingsListShown: boolean;
}

interface ActionBarState {

}

export class ActionBar extends React.Component<ActionBarProps, ActionBarState> {
    render () {
        return (
        <div className="action-bar">
            <div className="action-bar-upper">
                { this.props.buildingsListShown &&
                <BuildingsList/>}
            </div>
            <div className="action-bar-buttons">
                <button onClick={ () => store.dispatch(
                    showBuildingsList(!this.props.buildingsListShown)) }
                >Buildings</button>
            </div>
        </div>
        );
    }
}

export const ConnectedActionBar = connect((state: StoreState) => {
    return {
        buildingsListShown: state.buildingsListShown
    };
})(ActionBar);