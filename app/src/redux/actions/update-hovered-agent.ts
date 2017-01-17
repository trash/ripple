import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

import {IAgentState} from '../../entity/components/agent';
import {IHungerState} from '../../entity/components/hunger';
import {ISleepState} from '../../entity/components/sleep';

export interface UpdateHoveredAgentAction {
    type: string;
    agent: IAgentState;
    hunger: IHungerState;
    sleep: ISleepState;
}

export function updateHoveredAgent (
    agent: IAgentState,
    hunger: IHungerState,
    sleep: ISleepState,
): UpdateHoveredAgentAction {
    return {
        type: actionTypes.UPDATE_HOVERED_AGENT,
        agent: agent,
        hunger: hunger,
        sleep: sleep
    };
}