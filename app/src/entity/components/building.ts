import {IComponent} from '../entityManager';
import {ComponentEnum} from '../componentEnum';
import {ICoordinates, IRowColumnCoordinates} from '../../interfaces';

export interface IBuildingState {
    name: string;
    entranceTile?: IRowColumnCoordinates;

    maxOccupants?: number;
    occupants?: number[];
    mustBeNextToWater?: boolean;
}

export interface IBuildingComponent extends IComponent {
    state: IBuildingState;
}

export let Building: IBuildingComponent = {
    name: 'building',
    enum: ComponentEnum.Building,
    state: {
        name: null,
        entranceTile: null,
        occupants: [],
        maxOccupants: 0,
        mustBeNextToWater: false
    }
};