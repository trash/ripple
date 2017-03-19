import {MapTile} from '../../map/tile';
import {UPDATE_HOVERED_RESOURCE} from './types';

import {IResourceState} from '../../entity/components';

export interface UpdateHoveredResource {
    type: UPDATE_HOVERED_RESOURCE;
    resource: IResourceState;
}

export function updateHoveredResource (
    resource: IResourceState
): UpdateHoveredResource {
    return {
        type: UPDATE_HOVERED_RESOURCE,
        resource: resource
    };
}