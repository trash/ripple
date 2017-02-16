import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

import {ItemProperty} from '../../data/ItemProperty';
import {constants} from '../../data/constants';

export interface IVisitorState {
    desiredItems?: ItemProperty[];
    gold?: number;
}

export interface IVisitorComponent extends IComponent {
    state: IVisitorState;
}

export let Visitor: IVisitorComponent = {
    name: 'visitor',
    enum: Component.Visitor,
    state: {
        desiredItems: [],
        gold: 0
    }
};