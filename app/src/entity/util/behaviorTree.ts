import {globalRefs} from '../../globalRefs';
import {IRowColumnCoordinates} from '../../interfaces';
import {Component} from '../ComponentEnum';
import {ChildStatus} from '../../b3/Core';

import {IBehaviorTreeState} from '../components';

import {BaseUtil} from './base';
import {positionUtil} from './';

export class BehaviorTreeUtil extends BaseUtil {
    getExecutionChain(tile: IRowColumnCoordinates): ChildStatus[] {
        // Expose info about the agent's behavior tree
        const behaviorTreeState = positionUtil.getEntitiesWithComponentInTile(
                tile,
                Component.Agent
            ).map(entityId => this.entityManager.getComponentDataForEntity(
                Component.BehaviorTree, entityId)
            )[0] as IBehaviorTreeState;
        const backupExecutionChain = behaviorTreeState.blackboard
            .get('lastExecutionChain', behaviorTreeState.tree.id) as {
                success: ChildStatus[];
                failure: ChildStatus[];
            }
        const executionChain = behaviorTreeState.tree.getExecutionChain();
        console.info(executionChain);
        console.info(backupExecutionChain);

        if (backupExecutionChain) {
            return backupExecutionChain.success.reverse();
        }
    }

    getLastActionNameFromExecutionChain(executionChain: ChildStatus[]): string {
        if (!executionChain || !executionChain.length) {
            return '<N/A>';
        }
        return executionChain[executionChain.length - 1].child.constructor.name;
    }
}

export const behaviorTreeUtil = new BehaviorTreeUtil();