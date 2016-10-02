import {IRowColumnCoordinates} from '../interfaces';

export class MapTile implements IRowColumnCoordinates {
    accessible: boolean;
    row: number;
    column: number;
    index: number;
    data: string;

    constructor (
        row: number,
        column: number,
        dimension: number,
        data: string
    ) {
        this.index = row * dimension + column;
        this.row = row;
        this.column = column;
        this.data = data;
    }

    get isWater (): boolean {
        return this.data.includes('water');
    }
}