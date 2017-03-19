import {MapTile} from '../../map/tile';
import {UPDATE_HOVERED_AGENT_LAST_EXECUTION_CHAIN} from './types';
import {ChildStatus} from '../../b3/Core';

export interface UpdateHoveredAgentLastExecutionChain {
    type: UPDATE_HOVERED_AGENT_LAST_EXECUTION_CHAIN;
    executionChain: ChildStatus[];
}

export function updateHoveredAgentLastExecutionChain (
    executionChain: ChildStatus[]
): UpdateHoveredAgentLastExecutionChain {
    return {
        type: UPDATE_HOVERED_AGENT_LAST_EXECUTION_CHAIN,
        executionChain: executionChain
    };
}