import {IRowColumnCoordinates} from '../interfaces';

export class MapTile implements IRowColumnCoordinates {
    isWater: boolean;
    row: number;
    column: number;
    index: number;
    data: string;
    collision: boolean; // Whether something that causes a collision occupies it

    constructor (
        row: number,
        column: number,
        dimension: number,
        data: string,
        isWater: boolean
    ) {
        this.index = row * dimension + column;
        this.row = row;
        this.column = column;
        this.data = data;
        this.isWater = isWater;
    }

    get accessible (): boolean {
        return this.isWater || this.collision;
    }
}