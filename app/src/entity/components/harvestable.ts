import {IComponent} from '../entityManager';
import {ComponentEnum} from '../componentEnum';
import {Task} from '../../Tasks/task';
import {Instance} from '../../Tasks/instance';
import {Professions} from '../../data/professions';
import {HarvestTypes} from '../../data/harvestTypes';

export interface IHarvestableState {
    highlighted: boolean;
    queued: boolean;
    task: Task;
    profession: Professions;
    drops: string[];
    itemsDropped?: boolean;
    harvestType: HarvestTypes;
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