import * as React from 'react'
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {
    showBuildingsList,
    showDebugBar,
    showCraftBar
} from '../../redux/Actions';
import {BuildingsList} from './BuildingsList';
import {DebugBar} from './DebugBar';

import {dataList as itemList} from '../../entity/assemblageData/items';
import {Profession} from '../../data/Profession';
import {taskQueueManager} from '../../Tasks/TaskQueueManager';

const createCraftTask = (item: string, profession: Profession) => {
    const taskQueue = taskQueueManager.professionTaskQueue(profession);
    taskQueue.push(item);
}

export class CraftBar extends React.Component<void, void> {
    render() {
        return (
        <div className="action-bar-buttons">
        {itemList.filter(item => !!item.craftable).map(item => {
            const itemName = item.item.name;
            return (
            <button key={itemName}
                onClick={() => createCraftTask(itemName, item.craftable.profession)}
            >{itemName}</button>
            );
        })}
        </div>
        );
    }
}

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