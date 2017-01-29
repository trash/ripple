import {IComponent} from '../entityManager';
import {Components} from '../ComponentsEnum';
import {BehaviorTree as B3BehaviorTree, Blackboard} from '../../b3/Core';

export interface IBehaviorTreeState {
    tree: B3BehaviorTree;
    blackboard?: Blackboard;
    currentAction?: string;
}
export interface IBehaviorTreeComponent extends IComponent {
    state: IBehaviorTreeState;
}

export let BehaviorTree: IBehaviorTreeComponent = {
    name: 'behavior-tree',
    enum: Components.BehaviorTree,
    state: {
        tree: null,
        blackboard: null,
        currentAction: null
    }
}