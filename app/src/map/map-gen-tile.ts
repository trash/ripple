import {Direction, IRowColumnCoordinates} from '../interfaces';
import {positionUtil} from '../entity/util';
import {MapUtil} from './map-util';
import {BaseTile} from './BaseTile';

export class MapGenTile extends BaseTile {
    zoneNumber: number;
    data: string;
    index: number;
    borderWater: boolean;
    dimension: number;
	resource: string;
	isWater: boolean;

    static copyTile (tile: MapGenTile): MapGenTile {
        const copy = new MapGenTile(tile.data, tile.index, tile.dimension, tile.isWater);
        copy.borderWater = tile.borderWater;
        copy.zoneNumber = tile.zoneNumber;
		copy.resource = tile.resource;
        return copy;
    }

    constructor (
		data: string,
		index: number,
		dimension: number,
		isWater: boolean
	) {
		super(dimension);
        this.data = data;
        this.index = index;
		this.isWater = isWater;
        this.borderWater = false;
        this.dimension = dimension;
    }

    get accessible () {
        return !this.isWater;
    }
    get column () {
        return this.index % this.dimension;
    }
    get row () {
        return Math.floor(this.index / this.dimension);
    }

	get isBridge (): boolean {
		return this.data.includes('bridge');
	}

	directionToTile (nextTile: IRowColumnCoordinates): Direction {
		return positionUtil.directionToTile(this, nextTile);
	}
}