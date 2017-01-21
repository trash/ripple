import {MapTile} from '../../map/tile';
import {actionTypes} from './types';
import {ChildStatus} from '../../b3/Core';

export interface UpdateHoveredAgentLastExecutionChainAction {
    type: string;
    executionChain: ChildStatus[];
}

export function updateHoveredAgentLastExecutionChain (
    executionChain: ChildStatus[]
): UpdateHoveredAgentLastExecutionChainAction {
    return {
        type: actionTypes.UPDATE_HOVERED_AGENT_LAST_EXECUTION_CHAIN,
        executionChain: executionChain
    };
}