import {IRowColumnCoordinates} from '../interfaces';
import {BaseTile} from './BaseTile';
import {Util} from '../util';

export class MapTile extends BaseTile {
    isWater: boolean;
    row: number;
    column: number;
    index: number;
    data: string;
    // Whether something that causes a collision occupies it
    collision: boolean;
    // Essentially a semaphore representing how many soft collidable entities
    // are in the given tile.
    softCollision: number;

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
        this.softCollision = 0;
    }

    get accessible (): boolean {
        return !this.isWater && !this.collision;
    }

    isEqual (other: MapTile): boolean {
        return this.index === other.index;
    }
    isEqualToCoords (other: IRowColumnCoordinates): boolean {
        return Util.rowColumnCoordinatesAreEqual(this, other);
    }
}