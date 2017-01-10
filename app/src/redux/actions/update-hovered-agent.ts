import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

import {IAgentState} from '../../entity/components/agent';
import {IHungerState} from '../../entity/components/hunger';

export interface UpdateHoveredAgentAction {
    type: string;
    agent: IAgentState;
    hunger: IHungerState;
}

export function updateHoveredAgent (
    agent: IAgentState,
    hunger: IHungerState
): UpdateHoveredAgentAction {
    return {
        type: actionTypes.UPDATE_HOVERED_AGENT,
        agent: agent,
        hunger: hunger
    };
}