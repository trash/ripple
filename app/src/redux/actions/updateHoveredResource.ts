import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

import {IResourceState} from '../../entity/components';

export interface UpdateHoveredResource {
    type: string;
    resource: IResourceState;
}

export function updateHoveredResource (
    resource: IResourceState
): UpdateHoveredResource {
    return {
        type: actionTypes.UPDATE_HOVERED_RESOURCE,
        resource: resource
    };
}