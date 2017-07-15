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
import {EntityList} from './EntityList';
import {AutoUpdate} from '../higherOrder/AutoUpdate';

interface BuildingListProps {
    buildings: Immutable.List<BuildingListEntry>;
    buildingListSelected: number;
}

export class BuildingListComponent extends React.Component<BuildingListProps, object> {
    entityList: EntityList;

    selectEntity(id: number): void {
        this.entityList.toggleBottomOpen(true);
        store.dispatch(buildingListSelect(id));
    }

    render() {
        const selectedBuilding = this.props.buildings.find(agent =>
            agent.id === this.props.buildingListSelected
        );

        return <EntityList
            ref={el => this.entityList = el}
            topContent={[
                <div key="nah" className="entity-list-header">
                    <div className="id-column">Id</div>
                    <div className="sprite-column"></div>
                    <div className="health-column">Health</div>
                    <div className="type-column">Type</div>
                </div>,
                ...this.props.buildings.map(buildingEntry => {
                    return (
                        <div className="entity-list-entry"
                            onClick={() => this.selectEntity(buildingEntry.id)}
                            key={buildingEntry.id}>
                            <div className="id-column">{buildingEntry.id}</div>
                            <div className="sprite-column">
                                <img src={buildingUtil.getImagePath(buildingEntry.building.enum)}/>
                            </div>
                            <div className="health-column">{healthUtil.toString(buildingEntry.health, 'DESTROYED')}</div>
                            <div className="type-column">{Building[buildingEntry.building.enum]}</div>
                        </div>
                    );
                }).toArray()
            ]}
            bottomContent={[
                <BuildingInfoCard key="no" selectedBuilding={selectedBuilding} detailed={true}/>
            ]}/>;
    }
}

const BuildingList = AutoUpdate(BuildingListComponent, 1000);

export const ConnectedBuildingList = connect((state: StoreState) => {
    return {
        buildings: state.buildingsList,
        buildingListSelected: state.buildingListSelected
    };
}, function(){return{}} as any)(BuildingList);