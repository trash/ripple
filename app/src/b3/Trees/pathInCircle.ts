import * as Core from '../Core';
import {PathInCircle} from '../Actions/PathAroundMap';

export const behaviorTree = new Core.BehaviorTree();
behaviorTree.root = new PathInCircle();