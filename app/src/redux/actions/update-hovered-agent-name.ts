import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

export interface UpdateHoveredAgentNameAction {
    type: string;
    name: string;
}

export function updateHoveredAgentName (name: string): UpdateHoveredAgentNameAction {
    return {
        type: actionTypes.UPDATE_HOVERED_AGENT_NAME,
        name: name
    };
}