import * as React from 'react'
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {
    showBuildingsList,
    showDebugBar,
    showCraftBar
} from '../../redux/actions';
import {BuildingsList} from './BuildingsList';
import {DebugBar} from './DebugBar';
import {CraftBar} from './CraftBar';

interface ActionBarProps {
    buildingsListShown: boolean;
    debugBarShown: boolean;
    craftBarShown: boolean;
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
                { this.props.craftBarShown &&
                <CraftBar/>}
            </div>
            <div className="action-bar-buttons">
                <button onClick={() => store.dispatch(
                    showBuildingsList(!this.props.buildingsListShown))}
                >Buildings</button>
                <button onClick={() => store.dispatch(
                    showDebugBar(!this.props.debugBarShown))}
                >Debug</button>
                <button onClick={() => store.dispatch(
                    showCraftBar(!this.props.craftBarShown))}
                >Craft</button>
            </div>
        </div>
        );
    }
}

export const ConnectedActionBar = connect((state: StoreState) => {
    return {
        buildingsListShown: state.buildingsListShown,
        debugBarShown: state.debugBarShown,
        craftBarShown: state.craftBarShown
    };
})(ActionBar);