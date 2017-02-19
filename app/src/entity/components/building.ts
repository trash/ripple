import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {XYCoordinates, IRowColumnCoordinates} from '../../interfaces';
import {Building as BuildingEnum} from '../../data/Building';

export interface IBuildingState {
    enum: BuildingEnum;
    name?: string;
    entranceTile?: IRowColumnCoordinates;

    maxOccupants?: number;
    occupants?: number[];
    mustBeNextToWater?: boolean;
}

export const Building: IComponent<IBuildingState> = {
    name: 'building',
    enum: Component.Building,
    getInitialState: () => {
        return {
            enum: null,
            name: null,
            entranceTile: null,
            occupants: [],
            maxOccupants: 0,
            mustBeNextToWater: false
        };
    }
};