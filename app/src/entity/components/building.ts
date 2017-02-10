import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {ICoordinates, IRowColumnCoordinates} from '../../interfaces';
import {Building as BuildingEnum} from '../../data/Building';

export interface IBuildingState {
    enum: BuildingEnum;
    name?: string;
    entranceTile?: IRowColumnCoordinates;

    maxOccupants?: number;
    occupants?: number[];
    mustBeNextToWater?: boolean;
}

export interface IBuildingComponent extends IComponent {
    state: IBuildingState;
}

export const Building: IBuildingComponent = {
    name: 'building',
    enum: Component.Building,
    state: {
        enum: null,
        name: null,
        entranceTile: null,
        occupants: [],
        maxOccupants: 0,
        mustBeNextToWater: false
    }
};