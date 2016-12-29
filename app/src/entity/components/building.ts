import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {ICoordinates, IRowColumnCoordinates} from '../../interfaces';

export interface IBuildingState {
    name: string;
    entrancePosition: ICoordinates;
    entranceTile?: IRowColumnCoordinates;

    maxOccupants?: number;
    occupants?: number[];
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
        occupants: [],
        maxOccupants: 0
    }
};