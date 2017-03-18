import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

import {ItemProperty} from '../../data/ItemProperty';
import {constants} from '../../data/constants';

export interface IVisitorState {
    desiredItems?: ItemProperty[];
    leaveTown?: boolean;
    boughtItem?: boolean;
}

export const Visitor: IComponent<IVisitorState> = {
    name: 'visitor',
    enum: Component.Visitor,
    getInitialState: () => {
        return {
            desiredItems: [],
            leaveTown: false,
            boughtItem: false
        };
    }
};