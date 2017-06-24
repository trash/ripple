import * as Immutable from 'immutable';
import * as React from 'react'
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {
    showBuildingsList,
    showDebugBar,
    showCraftBar
} from '../../redux/actions';
import {
    AgentListEntry,
    BuildingListEntry,
    ResourceListEntry
} from '../../interfaces';
import {SpawnBuildingList} from './SpawnBuildingList';
import {ConnectedDebugBar} from './DebugBar';
import {ConnectedCraftBar} from './CraftBar';
import {AgentInfoCard} from './AgentInfoCard';
import {ResourceInfoCard} from './ResourceInfoCard';
import {BuildingInfoCard} from './BuildingInfoCard';
import {ConnectedPlayspeedControls} from './PlayspeedControls';

interface ActionBarProps {
    buildingsListShown: boolean;
    debugBarShown: boolean;
    craftBarShown: boolean;
    agents: Immutable.List<AgentListEntry>;
    buildings: Immutable.List<BuildingListEntry>;
    resources: Immutable.List<ResourceListEntry>;
    agentListSelected: number;
    selectedEntities: number[];
}

export const ActionBar = (props: ActionBarProps) => {
    const selectedBuilding = props.buildings
        .find(building =>
            !!props.selectedEntities.find(entity => building.id === entity)
        );
    const selectedAgent = props.agents
        .find(agent =>
            !!props.selectedEntities.find(entity => agent.id === entity)
            || agent.id === props.agentListSelected);
    const selectedResource = props.resources
        .find(resource =>
            !!props.selectedEntities.find(entity => resource.id === entity)
        );

    let infoCard: JSX.Element;
    if (selectedBuilding) {
        infoCard = <BuildingInfoCard detailed={true} selectedBuilding={selectedBuilding}/>;
    } else if (selectedAgent) {
        infoCard = <AgentInfoCard detailed={true} selectedAgent={selectedAgent}/>;
    } else if (selectedResource) {
        infoCard = ResourceInfoCard(selectedResource);
    }

    return (
    <div className="action-bar-container">
        <div className="action-bar-card">
            {infoCard}
        </div>
        <div className="action-bar">
            <div className="action-bar-upper">
                { props.buildingsListShown &&
                <SpawnBuildingList/>}
                { props.debugBarShown &&
                <ConnectedDebugBar/>}
                { props.craftBarShown &&
                <ConnectedCraftBar/>}
            </div>
            <div className="action-bar-lower">
                <div className="action-bar-buttons">
                    <button onClick={() => store.dispatch(
                        showBuildingsList(!props.buildingsListShown))}
                    >Buildings</button>
                    <button onClick={() => store.dispatch(
                        showDebugBar(!props.debugBarShown))}
                    >Debug</button>
                    <button onClick={() => store.dispatch(
                        showCraftBar(!props.craftBarShown))}
                    >Craft</button>
                </div>
                <ConnectedPlayspeedControls/>
            </div>
        </div>
    </div>
    );
}

export const ConnectedActionBar = connect((state: StoreState) => {
    return {
        buildingsListShown: state.buildingsListShown,
        debugBarShown: state.debugBarShown,
        craftBarShown: state.craftBarShown,
        agents: state.agentsList,
        agentListSelected: state.agentListSelected,
        selectedEntities: state.selectedEntities,
        buildings: state.buildingsList,
        resources: state.resourcesList
    };
})(ActionBar);