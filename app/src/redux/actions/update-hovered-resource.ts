import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

import {IResourceState} from '../../entity/components/resource';

export interface UpdateHoveredResourceAction {
    type: string;
    resource: IResourceState;
}

export function updateHoveredResource (
    resource: IResourceState
): UpdateHoveredResourceAction {
    return {
        type: actionTypes.UPDATE_HOVERED_RESOURCE,
        resource: resource
    };
}