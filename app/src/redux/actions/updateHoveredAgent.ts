import {MapTile} from '../../map/tile';
import {actionTypes} from './types';
import {
    IAgentState,
    IHungerState,
    ISleepState,
    IPositionState,
    IVillagerState
} from '../../entity/components';

export interface UpdateHoveredAgent {
    type: string;
    agent: IAgentState;
    hunger: IHungerState;
    sleep: ISleepState;
    position: IPositionState;
    villager: IVillagerState;
}

export function updateHoveredAgent (
    agent: IAgentState,
    hunger: IHungerState,
    sleep: ISleepState,
    position: IPositionState,
    villager: IVillagerState
): UpdateHoveredAgent {
    return {
        type: actionTypes.UPDATE_HOVERED_AGENT,
        agent: agent,
        hunger: hunger,
        sleep: sleep,
        position: position,
        villager: villager
    };
}