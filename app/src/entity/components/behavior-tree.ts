import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {BehaviorTree as B3BehaviorTree} from '../../b3/core/behavior-tree';
import {Blackboard} from '../../b3/core/blackboard';

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
    enum: ComponentEnum.BehaviorTree,
    state: {
        tree: null,
        blackboard: null,
        currentAction: null
    }
}