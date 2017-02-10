import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {Task} from '../../Tasks/Task';
import {Instance} from '../../Tasks/Instance';
import {Profession} from '../../data/Profession';
import {HarvestType} from '../../data/harvestType';

export interface IHarvestableState {
    highlighted: boolean;
    queued: boolean;
    task: Task;
    profession: Profession;
    drops: string[];
    itemsDropped?: boolean;
    harvestType: HarvestType;
}

export interface IHarvestableComponent extends IComponent {
    state: IHarvestableState;
}

export let Harvestable: IHarvestableComponent = {
    name: 'harvestable',
    enum: Component.Harvestable,
    state: {
        highlighted: false,
        queued: false,
        task: null,
        profession: null,
        drops: [],
        itemsDropped: false,
        harvestType: null
    }
};