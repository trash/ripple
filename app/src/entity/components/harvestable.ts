import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {Task} from '../../Tasks/Task';
import {Instance} from '../../Tasks/Instance';
import {Profession} from '../../data/Profession';
import {HarvestType} from '../../data/harvestType';
import {Item} from '../../data/Item';

export interface IHarvestableState {
    highlighted: boolean;
    queued: boolean;
    task: Task;
    profession: Profession;
    drops: [Item, string][];
    itemsDropped?: boolean;
    harvestType: HarvestType;
}

export const Harvestable: IComponent<IHarvestableState> = {
    name: 'harvestable',
    enum: Component.Harvestable,
    getInitialState: () => {
        return {
            highlighted: false,
            queued: false,
            task: null,
            profession: null,
            drops: [],
            itemsDropped: false,
            harvestType: null
        };
    }
};