import * as React from 'react';
import {ResourceListEntry} from '../../interfaces';

import {
    IResourceState
} from '../../entity/components';

import {
    DisplayProperty,
    filterAndRenderProperties,
    renderHealthProperties,
    renderPositionProperties
} from './InfoCard';

const renderResourceProperties = (state: IResourceState): DisplayProperty[] => [
    {
        name: 'Name',
        value: state.name,
        detailedOnly: false
    }
];

export const ResourceInfoCard = (
    selectedResource: ResourceListEntry,
    detailed: boolean = false
) => {
    if (!selectedResource) {
        return null;
    }
    return (
        <div className="agent-info-card">
            <div>Id: {selectedResource.id}</div>
            {/*<div>
                <img src={buildingUtil.getImagePath(selectedResource.building.enum)}/>
            </div>*/}
            { filterAndRenderProperties(
                detailed,
                renderResourceProperties(selectedResource.resource)
            ) }
            { filterAndRenderProperties(
                detailed,
                renderHealthProperties(selectedResource.health)
            ) }
            { filterAndRenderProperties(
                detailed,
                renderPositionProperties(selectedResource.position)
            ) }
        </div>
    );
}