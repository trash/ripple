import {MapTile} from '../../map/tile';
import {UPDATE_HOVERED_AGENT} from './types';
import {
    IAgentState,
    IHungerState,
    ISleepState,
    IPositionState,
    IVillagerState,
    IStatusBubbleState,
    IVisitorState,
    IInventoryState
} from '../../entity/components';

export interface UpdateHoveredAgent {
    type: UPDATE_HOVERED_AGENT;
    id: number;
    agent: IAgentState;
    hunger: IHungerState;
    sleep: ISleepState;
    position: IPositionState;
    villager: IVillagerState;
    statusBubble: IStatusBubbleState;
    visitor: IVisitorState;
    inventory: IInventoryState;
}

export function updateHoveredAgent (
    id: number,
    agent: IAgentState,
    hunger: IHungerState,
    sleep: ISleepState,
    position: IPositionState,
    villager: IVillagerState,
    statusBubble: IStatusBubbleState,
    visitor: IVisitorState,
    inventory: IInventoryState
): UpdateHoveredAgent {
    return {
        id,
        type: UPDATE_HOVERED_AGENT,
        agent,
        hunger,
        sleep,
        position,
        villager,
        statusBubble,
        visitor,
        inventory
    };
}