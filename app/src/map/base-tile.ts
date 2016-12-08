import {IRowColumnCoordinates} from '../interfaces';
import {MapUtil} from './map-util';

export abstract class BaseTile implements IRowColumnCoordinates {
	row: number;
	column: number;
	index: number;
	dimension: number;

	constructor(dimension: number) {
		this.dimension = dimension;
	}

	toString(): string {
		return `[${this.row},${this.column}]`;
	}

	_rowFromIndex (index: number) {
        return Math.floor(index / this.dimension);
    }
    _columnFromIndex (index: number) {
        return index % this.dimension;
    }

    /**
	 * Return the euclidian distance from this tile to another.
	 *
	 * @param  {Tile} tile The other tile to calculate the distance to.
	 * @param {Boolean} [floor=false] Floor the return value
	 * @return {float} The euclidean distance.
	 */
	distanceTo (tile: BaseTile, floor?: boolean): number {
		return MapUtil.distanceTo(this, tile, floor);
	}

    getSiblings (corners: boolean = false): number[] {
		const siblings = [this.leftSibling(), this.rightSibling(), this.topSibling(), this.bottomSibling()];
		if (corners) {
			siblings.push(this.topLeftSibling(), this.topRightSibling(), this.bottomLeftSibling(), this.bottomRightSibling());
		}
		return siblings.filter(index => {
			return index !== null &&
				// Upper bound
				index !== Math.pow(this.dimension, 2) &&
				// Lower bound
				index > -1;
		});
	}

    _leftSibling (index: number) {
        if (this._columnFromIndex(index) === 0) {
			return null;
		}
		return index - 1;
    }

    /**
	* Gets the left sibling of this tile
	*
	* @return {element} The left sibling of the tile
	*/
	leftSibling (): number {
		return this._leftSibling(this.index);
	}

    _rightSibling (index: number) {
        if (this._columnFromIndex(index) === Math.pow(this.dimension, 2) - 1) {
			return null;
		}
		return index + 1;
    }

	/**
	* Gets the right sibling of this tile
	*
	* @return {element} The right sibling of the tile
	*/
	rightSibling (): number {
		return this._rightSibling(this.index);
	}

    _topSibling (index: number) {
        if (this._rowFromIndex(index) === 0) {
			return null;
		}
		return index - this.dimension;
    }

	/**
	* Gets the top sibling of this tile
	*
	* @return {element} The top sibling of the tile
	*/
	topSibling (): number {
        return this._topSibling(this.index);
	}

    _bottomSibling (index: number) {
        if (this._rowFromIndex(index) === this.dimension - 1) {
			return null;
		}
		return index + this.dimension;
    }

	/**
	* Gets the bottom sibling of this tile
	*
	* @return {element} The bottom sibling of the tile
	*/
	bottomSibling (): number {
		return this._bottomSibling(this.index);
	}

	topLeftSibling (): number {
		const top = this.topSibling();
		if (top) {
            return this._leftSibling(top);
		}
		return null;
	}

	topRightSibling (): number {
		const top = this.topSibling();
		if (top) {
			return this._rightSibling(top);
		}
		return null;
	}

	bottomLeftSibling (): number {
		const bottom = this.bottomSibling();
		if (bottom) {
			return this._leftSibling(bottom);
		}
		return null;
	}

	bottomRightSibling (): number {
		const bottom = this.bottomSibling();
		if (bottom) {
			return this._rightSibling(bottom);
		}
		return null;
	}
}