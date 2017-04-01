import * as React from 'react';
import {BuildingListEntry} from '../../interfaces';
import {Building} from '../../data/Building';
import {buildingUtil} from '../../entity/util';

import {
    IVillagerState,
    IAgentState,
    IVisitorState,
    IPositionState,
    IHealthState,
    IBuildingState
} from '../../entity/components';

import {
    DisplayProperty,
    filterAndRenderProperties,
    renderHealthProperties,
    renderPositionProperties
} from './InfoCard';

const renderBuildingProperties = (buildingState: IBuildingState): DisplayProperty[] => [
    {
        name: 'Name',
        value: buildingState.name,
        detailedOnly: true
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
                renderHealthProperties(selectedBuilding.health)
            ) }
            { filterAndRenderProperties(
                detailed,
                renderPositionProperties(selectedBuilding.position)
            ) }
        </div>
    );
}