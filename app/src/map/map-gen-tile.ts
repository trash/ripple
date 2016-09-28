export class MapGenTile {
    zoneNumber: number;
    data: string;
    index: number;
    borderWater: boolean;
    dimension: number;

    constructor (data: string, index: number, dimension: number) {
        this.data = data;
        this.index = index;
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

    get isWater () {
        return this.data.includes('water');
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
	distanceTo (tile: MapGenTile, floor: boolean = false): number {
		var x = Math.pow((this.column - tile.column), 2),
			y = Math.pow((this.row - tile.row), 2),
			distance = Math.sqrt(x + y);

		if (floor) {
			return Math.floor(distance);
		}

		return distance;
	}

    getSiblings (corners: boolean = false): number[] {
		const siblings = [this.leftSibling(), this.rightSibling(), this.topSibling(), this.bottomSibling()];
		if (corners) {
			siblings.push(this.topLeftSibling(), this.topRightSibling(), this.bottomLeftSibling(), this.bottomRightSibling());
		}
		return siblings.filter(index => {
			return index !== null;
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