import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {ICoordinates} from '../../interfaces';
import {Tile} from '../../map/tile';

export interface IBuildingState {
    name: string;
    entrancePosition: ICoordinates;
    entranceTile?: Tile;
}

export interface IBuildingComponent extends IComponent {
    state: IBuildingState;
}

export let Building: IBuildingComponent = {
    name: 'building',
    enum: ComponentEnum.Building,
    state: {
        name: null,
        entrancePosition: null,
        entranceTile: null,
    }
};