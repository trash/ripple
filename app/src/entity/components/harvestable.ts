import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {Task} from '../../tasks/task';
import {Instance} from '../../tasks/instance';
import {Professions} from '../../data/professions';

export enum HarvestTypesEnum {
    tree,
    food,
    rock,
    mushroom
}

export interface IHarvestableState {
    highlighted: boolean;
    queued: boolean;
    task: Task;
    profession: Professions;
    drops: string[];
    itemsDropped?: boolean;
    harvestType: HarvestTypesEnum;
}

export interface IHarvestableComponent extends IComponent {
    state: IHarvestableState;
}

export let Harvestable: IHarvestableComponent = {
    name: 'harvestable',
    enum: ComponentEnum.Harvestable,
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