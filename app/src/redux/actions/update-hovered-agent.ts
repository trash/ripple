import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

import {IAgentState} from '../../entity/components/agent';
import {IHungerState} from '../../entity/components/hunger';
import {ISleepState} from '../../entity/components/sleep';
import {IPositionState} from '../../entity/components/position';

export interface UpdateHoveredAgentAction {
    type: string;
    agent: IAgentState;
    hunger: IHungerState;
    sleep: ISleepState;
    position: IPositionState;
}

export function updateHoveredAgent (
    agent: IAgentState,
    hunger: IHungerState,
    sleep: ISleepState,
    position: IPositionState,
): UpdateHoveredAgentAction {
    return {
        type: actionTypes.UPDATE_HOVERED_AGENT,
        agent: agent,
        hunger: hunger,
        sleep: sleep,
        position: position
    };
}