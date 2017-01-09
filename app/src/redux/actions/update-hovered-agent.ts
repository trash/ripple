import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

import {IAgentState} from '../../entity/components/agent';

export interface UpdateHoveredAgentAction {
    type: string;
    agent: IAgentState;
}

export function updateHoveredAgent (
    agent: IAgentState
): UpdateHoveredAgentAction {
    return {
        type: actionTypes.UPDATE_HOVERED_AGENT,
        agent: agent
    };
}