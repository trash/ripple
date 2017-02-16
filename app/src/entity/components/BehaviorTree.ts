import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {BehaviorTree as B3BehaviorTree, Blackboard} from '../../b3/Core';

export interface IBehaviorTreeState {
    tree: B3BehaviorTree;
    blackboard?: Blackboard;
    currentAction?: string;
}

export const BehaviorTree: IComponent<IBehaviorTreeState> = {
    name: 'behavior-tree',
    enum: Component.BehaviorTree,
    getInitialState: () => {
        return {
            tree: null,
            blackboard: null,
            currentAction: null
        };
    }
}