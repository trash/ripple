import {MapTile} from '../../map/tile';
import {actionTypes} from './types';
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
    type: string;
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
        type: actionTypes.UPDATE_HOVERED_AGENT,
        agent: agent,
        hunger: hunger,
        sleep: sleep,
        position: position,
        villager: villager,
        statusBubble: statusBubble,
        visitor: visitor,
        inventory: inventory
    };
}