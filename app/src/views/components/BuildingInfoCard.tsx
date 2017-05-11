import * as React from 'react';
import {BuildingListEntry} from '../../interfaces';
import {Building} from '../../data/Building';
import {buildingUtil, storageUtil} from '../../entity/util';

import {BuildingStorageView} from './BuildingStorageView';

import {
    IBuildingState,
    IConstructibleState,
    IStorageState
} from '../../entity/components';

import {
    DisplayProperty,
    filterAndRenderProperties,
    renderHealthProperties,
    renderPositionProperties
} from './InfoCard';

const renderBuildingProperties = (state: IBuildingState): DisplayProperty[] => [
    {
        name: 'Name',
        value: state.name,
        detailedOnly: true
    },
    {
        name: 'Occupant Capacity',
        value: buildingUtil.occupancyToString(state),
        detailedOnly: false
    },
    {
        name: 'Occupants',
        value: buildingUtil.occupancyToStringWithNames(state),
        detailedOnly: true
    },
];

const renderConstructibleProperties = (state: IConstructibleState): DisplayProperty[] => [
    {
        name: 'Resource Requirements',
        value: state.resourceRequirements.toString(),
        detailedOnly: false
    },
];

const renderStorageProperties = (state: IStorageState): DisplayProperty[] => [
    {
        name: 'Storage',
        value: storageUtil.availableStorageToString(state),
        detailedOnly: false
    }
];

export const BuildingInfoCard = (
    selectedBuilding: BuildingListEntry,
    detailed: boolean = false
) => {
    if (!selectedBuilding) {
        return null;
    }
    return (
        <div className="agent-info-card">
            <div>Id: {selectedBuilding.id}</div>
            <div>
                <img src={buildingUtil.getImagePath(selectedBuilding.building.enum)}/>
            </div>
            { filterAndRenderProperties(
                detailed,
                renderBuildingProperties(selectedBuilding.building)
            ) }
            { filterAndRenderProperties(
                detailed,
                renderConstructibleProperties(selectedBuilding.constructible)
            ) }
            { filterAndRenderProperties(
                detailed,
                renderHealthProperties(selectedBuilding.health)
            ) }
            { filterAndRenderProperties(
                detailed,
                renderPositionProperties(selectedBuilding.position)
            ) }
            { selectedBuilding.storage && filterAndRenderProperties(
                detailed,
                renderStorageProperties(selectedBuilding.storage)
            ) }
            {selectedBuilding.storage && detailed &&
                <BuildingStorageView storage={selectedBuilding.storage}/>
            }
        </div>
    );
}