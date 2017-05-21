import * as _ from 'lodash';
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';
import {ItemRequirements} from '../../ItemRequirements';
import {
    IBehaviorTreeState,
    IVisitorState
} from '../components';
import {visitor as visitorTree} from '../../b3/Trees';

export class VisitorSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const visitorState = this.manager.getComponentDataForEntity(
                Component.Visitor, id) as IVisitorState;
            const behaviorTreeState = this.manager.getComponentDataForEntity(
                Component.BehaviorTree, id) as IBehaviorTreeState;

            if (!visitorState.recruitState && visitorState.recruitCost) {
                visitorState.recruitState = new ItemRequirements(visitorState.recruitCost);
            }
        });
    }
}