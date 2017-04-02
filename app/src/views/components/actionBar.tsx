import * as Immutable from 'immutable';
import * as React from 'react'
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
import {BuildingsList} from './BuildingsList';
import {DebugBar} from './DebugBar';
import {CraftBar} from './CraftBar';
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
    selectedEntity: number;
}

export class ActionBar extends React.Component<ActionBarProps, void> {
    render () {
        const selectedBuilding = this.props.buildings
            .find(building => building.id === this.props.selectedEntity);
        const selectedAgent = this.props.agents
            .find(agent =>
                agent.id === this.props.selectedEntity
                || agent.id === this.props.agentListSelected);
        const selectedResource = this.props.resources
            .find(resource => resource.id === this.props.selectedEntity);

        let infoCard: JSX.Element;
        if (selectedBuilding) {
            infoCard = BuildingInfoCard(selectedBuilding);
        } else if (selectedAgent) {
            infoCard = AgentInfoCard(selectedAgent);
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
                    { this.props.buildingsListShown &&
                    <BuildingsList/>}
                    { this.props.debugBarShown &&
                    <DebugBar/>}
                    { this.props.craftBarShown &&
                    <CraftBar/>}
                </div>
                <div className="action-bar-lower">
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
                    <ConnectedPlayspeedControls/>
                </div>
            </div>
        </div>
        );
    }
}

export const ConnectedActionBar = connect((state: StoreState) => {
    return {
        buildingsListShown: state.buildingsListShown,
        debugBarShown: state.debugBarShown,
        craftBarShown: state.craftBarShown,
        agents: state.agentsList,
        agentListSelected: state.agentListSelected,
        selectedEntity: state.selectedEntity,
        buildings: state.buildingsList,
        resources: state.resourcesList
    };
})(ActionBar);