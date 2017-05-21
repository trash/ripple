import * as Immutable from 'immutable';
import {connect} from 'react-redux';
import * as React from 'react';
import {store, StoreState} from '../../redux/store';
import {buildingListSelect} from '../../redux/actions';
import {IBuildingState} from '../../entity/components';
import {BuildingListEntry} from '../../interfaces';
import {Building} from '../../data/Building';
import {buildingUtil, healthUtil} from '../../entity/util';
import {BuildingInfoCard} from './BuildingInfoCard';

interface BuildingListProps {
    buildings: Immutable.List<BuildingListEntry>;
    buildingListSelected: number;
}

export class BuildingList extends React.Component<BuildingListProps, void> {
    render() {
        const selectedBuilding = this.props.buildings.find(agent =>
            agent.id === this.props.buildingListSelected
        );

        return (
        <div className="agent-list-container">
            <div className="agent-list">
                <div className="agent-list-header">
                    <div className="id-column">Id</div>
                    <div className="sprite-column"></div>
                    <div className="health-column">Health</div>
                    <div className="type-column">Type</div>
                </div>
                {this.props.buildings.map(buildingEntry => {
                    return (
                        <div className="agent-list-entry"
                            onClick={() => store.dispatch(buildingListSelect(buildingEntry.id))}
                            key={buildingEntry.id}>
                            <div className="id-column">{buildingEntry.id}</div>
                            <div className="sprite-column">
                                <img src={buildingUtil.getImagePath(buildingEntry.building.enum)}/>
                            </div>
                            <div className="health-column">{healthUtil.toString(buildingEntry.health)}</div>
                            <div className="type-column">{Building[buildingEntry.building.enum]}</div>
                        </div>
                    );
                })}
            </div>
            <div className="agent-list-bottom">
                <p>Detailed information on selected agent shown here.</p>
                <BuildingInfoCard selectedBuilding={selectedBuilding} detailed={true}/>
            </div>
        </div>
        );
    }
}

export const ConnectedBuildingList = connect((state: StoreState) => {
    return {
        buildings: state.buildingsList,
        buildingListSelected: state.buildingListSelected
    };
})(BuildingList);