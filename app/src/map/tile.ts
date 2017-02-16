import {IRowColumnCoordinates} from '../interfaces';
import {BaseTile} from './BaseTile';
import {util} from '../util';

export class MapTile extends BaseTile {
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
        super(dimension);
        this.index = row * dimension + column;
        this.row = row;
        this.column = column;
        this.data = data;
        this.isWater = isWater;
        this.collision = false;
    }

    get accessible (): boolean {
        return !this.isWater && !this.collision;
    }

    isEqual (other: MapTile): boolean {
        return this.index === other.index;
    }
    isEqualToCoords (other: IRowColumnCoordinates): boolean {
        return util.rowColumnCoordinatesAreEqual(this, other);
    }
}