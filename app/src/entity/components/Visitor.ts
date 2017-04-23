import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

import {ItemProperty} from '../../data/ItemProperty';
import {constants} from '../../data/constants';
import {RequiredResources} from '../../interfaces';
import {ResourceRequirements} from '../../ResourceRequirements';

export interface IVisitorState {
    desiredItems?: ItemProperty[];
    leaveTown?: boolean;
    boughtItem?: boolean;
    recruitCost?: RequiredResources;
    recruitState?: ResourceRequirements;
}

export const Visitor: IComponent<IVisitorState> = {
    name: 'visitor',
    enum: Component.Visitor,
    getInitialState: () => {
        return {
            desiredItems: [],
            leaveTown: false,
            boughtItem: false,
            recruitCost: [],
            recruitState: null
        };
    }
};