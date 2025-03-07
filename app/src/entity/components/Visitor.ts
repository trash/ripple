import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';

import {ItemProperty} from '../../data/ItemProperty';
import {constants} from '../../data/constants';
import {RequiredItems, ItemCountEntry, ItemCountMap} from '../../interfaces';
import {ItemRequirementsMap} from '../../ItemRequirementsMap';

export interface IVisitorState {
    desiredItems?: ItemProperty[];
    leaveTown?: boolean;
    boughtItem?: boolean;
    recruitCost?: RequiredItems;
    recruitState?: ItemRequirementsMap;
    itemsBought?: ItemCountMap;
}

export const Visitor: IComponent<IVisitorState> = {
    name: 'visitor',
    enum: Component.Visitor,
    getInitialState: () => {
        return {
            desiredItems: [],
            leaveTown: false,
            boughtItem: false,
            recruitCost: null,
            recruitState: null,
            itemsBought: {}
        };
    }
};