import _ = require('lodash');
import {util} from '../util';
import {GameMap} from './index';
import {events} from '../events';
import {Direction, ICoordinates} from '../interfaces';
import {professions} from '../data/professions';
import {config} from '../data/config';
import {canvasService} from '../ui/canvas-service';

interface StringCoordinates {
	x: string;
	y: string;
};

 /**
  * Creates a new Tile object.
  *
  * @classdesc A tile or the smallest unit of a map.
  *
  * @constructor
  * @param {Map} map a map that the tile belongs to
  * @param {int} index the column number of the tile
 */
export class Tile {
	map: GameMap;
	index: number;
	row: number;
	column: number;
	resource: string | number;
	tilemapData: any;
	_accessible: boolean;
	water: boolean;
	hill: string;
	wall: boolean;
	bridge: boolean;
	zoneNumber: number;
	borderWater: boolean;
	isEntrance: boolean;
	updateGrid: Function;

	constructor (map: any, index: number, options?: any) {
		// The map this tile belongs to
		this.map = map;

		// This will increase performance if a bunch of tiles have their accessible
		// property updated at once we can wait till they're done to update the map
		this.updateGrid = _.debounce(() => {
			this.map.updateGrid()
		}, 5);

		// The index within the maps children
		this.index = index;
		// The row and column this tile occupies in the map
		this.row = Math.floor(index / this.map.dimension);
		this.column = this.index - this.row * this.map.dimension;

		// The resource associated with the tile
		this.resource = options.resource;
		// Handle assigning the tilemap code
		this.tilemapData = options.data;

		// Whether the tile is accessible for walking or not (default to true for now)
		this.accessible = !options.water;

		this.water = options.water;
	}

	get accessible () {
		return this._accessible;
	}

	set accessible (value: boolean) {
		this._accessible = value;
		this.updateGrid();
	}

	clearResource () {
		this.resource = null;
	}

	/**
	 * Returns simple json structure of coords
	 * This makes a tile able to printed to the console without
	 * circular json structure errors
	 *
	 * @return {Object} The x,y coords of the tile
	 */
	json (): ICoordinates  {
		return {
			x: this.column,
			y: this.row
		};
	}

	closestSiblingTile (fromTile: Tile): Tile {
		return this.getSiblings()
			.filter(tile => tile.accessible)
			// double check for path
			// NOTE: this can be improved if we calculate zones when walls are built
			.filter(tile => this.map.pathExists(tile, fromTile))
			.sort((a, b) => a.distanceTo(fromTile) - b.distanceTo(fromTile))
			[0];
	}

	getWallSprite (): string {
		return this.map.normalizeWallTile(this);
	}

	serializePosition (): [number, number] {
		return [this.row, this.column];
	}

	/**
	* Return the nearest tile from the set to the current tile
	*/
	nearestTileFromSet (tileSet: Tile[]): number {
		var nearestDistance = 999999,
			nearestIndex = null;
		tileSet.forEach(function (tile, index) {
			var distance = this.distanceTo(tile);
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestIndex = index;
			}
		}.bind(this));
		return nearestIndex;
	}

	directionToTile (nextTile: Tile): Direction {
		var rowDiff = nextTile.row - this.row,
			columnDiff = nextTile.column - this.column;

		// Vertical
		if (rowDiff) {
			// Down
			if (rowDiff > 0) {
				return 'down';
			}
			// Up
			else {
				return 'up';
			}
		}
		// Horizontal
		else if (columnDiff) {
			// Right
			if (columnDiff > 0) {
				return 'right';
			}
			// Left
			else {
				return 'left';
			}
		}
		return null;
	}

	getAccessibleSibling (): Tile {
		let siblings = this.getSiblings();
		for (let i=0; i < siblings.length; i++) {
			let sibling = siblings[i];
			if (sibling.accessible) {
				return sibling;
			}
		}
		return null;
	}

	getSiblings (corners?: boolean): Tile[] {
		var siblings = [this.leftSibling(), this.rightSibling(), this.topSibling(), this.bottomSibling()];
		if (corners) {
			siblings.push(this.topLeftSibling(), this.topRightSibling(), this.bottomLeftSibling(), this.bottomRightSibling());
		}
		return siblings.filter(function (tile) {
			return !!tile;
		});
	}

	isNextToWater (): boolean {
		return this.getSiblings().some(tile => tile.water);
	}

	toString (): string {
		return `column: ${this.column}, row: ${this.row}, accessible: ${this.accessible}`;
	}

	// Makes a water tile land
	makeLand () {
		this.tilemapData = 'empty';
		this.water = false;
		this.hill = null;

		// Update the grid if previously inaccessible tile become accessible
		var updateGrid = false;
		if (!this.accessible) {
			updateGrid = true;
		}
		this.accessible = true;

		if (updateGrid) {
			this.map.updateGrid();
		}
	}

	makeHill () {
		this.tilemapData = 'empty';
		this.hill = '';
		this.accessible = false;
	}

	makeBridge (first: boolean): string {
		// Don't do anything if it's not water
		if (!this.water) {
			return;
		}
		this.makeLand();
		this.bridge = true;
		this.tilemapData = first ?
			'water-bridge-base' :
			util.randomFromList(['water-bridge-1', 'water-bridge-2', 'water-bridge-3']);
	}

	/**
	 * A function to be called when the phaser game instance has been initialized.
	 * This exists because it relies on the phaser game existing to create sprites, etc.
	 */
	initialize () {
		// If there are resources on the tile, initialize them
		if (this.resource) {
			// Generate and attach resources to the tile
			this.generateResources();
		}
	}

	/**
	 * Return the euclidian distance from this tile to another.
	 *
	 * @param  {Tile} tile The other tile to calculate the distance to.
	 * @param {Boolean} [floor=false] Floor the return value
	 * @return {float} The euclidean distance.
	 */
	distanceTo (tile: Tile, floor?: boolean): number {
		var x = Math.pow((this.column - tile.column), 2),
			y = Math.pow((this.row - tile.row), 2),
			distance = Math.sqrt(x + y);

		if (floor) {
			return Math.floor(distance);
		}

		return distance;
	}

	generateResource (resource) {
		this.resource = resource;
		this.generateResources();
	}

	/**
	* Right now handles creating a Tree and attaching it to the tile
	*/
	generateResources () {
		const resourceName = this.resource as string;
		events.emit(['spawn', 'resource'], resourceName, this);
	}

	/**
	 * Returns the coordinates of the tile in pixels converted relative to the window (not canvas)
	 *
	 * @return {Object} coords The coordinates of the tile
	 * @return {String} coords.x The x coordinates as a string of the form "X px"
	 * @return {String} coords.y The y coordinates as a string of the form "X px"
	 */
	getPixelCoordinates (): StringCoordinates  {
		var canvasOffset = canvasService.getCanvasOffset();
		return {
			x: canvasOffset.x + this.column * this.map.scaledTileSize() + 'px',
			y: canvasOffset.y + this.row * this.map.scaledTileSize() + 'px'
		};
	}

	/**
	* Gets the left sibling of this tile
	*
	* @return {element} The left sibling of the tile
	*/
	leftSibling (): Tile {
		if (this.column === 0) {
			return null;
		}
		return this.map.tiles[this.index-1];
	}

	/**
	* Gets the right sibling of this tile
	*
	* @return {element} The right sibling of the tile
	*/
	rightSibling (): Tile {
		if (this.column === this.map.tiles.length-1) {
			return null;
		}
		return this.map.tiles[this.index+1];
	}

	/**
	* Gets the top sibling of this tile
	*
	* @return {element} The top sibling of the tile
	*/
	topSibling (): Tile {
		if (this.row === 0) {
			return null;
		}
		return this.map.tiles[this.index-this.map.dimension];
	}

	/**
	* Gets the bottom sibling of this tile
	*
	* @return {element} The bottom sibling of the tile
	*/
	bottomSibling (): Tile {
		if (this.row === this.map.dimension-1) {
			return null;
		}
		return this.map.tiles[this.index+this.map.dimension];
	}

	topLeftSibling (): Tile {
		var top = this.topSibling();
		if (top) {
			return top.leftSibling();
		}
		return null;
	}

	topRightSibling (): Tile {
		var top = this.topSibling();
		if (top) {
			return top.rightSibling();
		}
		return null;
	}

	bottomLeftSibling (): Tile {
		var bottom = this.bottomSibling();
		if (bottom) {
			return bottom.leftSibling();
		}
		return null;
	}

	bottomRightSibling (): Tile {
		var bottom = this.bottomSibling();
		if (bottom) {
			return bottom.rightSibling();
		}
		return null;
	}

	/**
	* Picks and returns a random sibling: top, bottom, left, or right
	*
	* @return {Tile} A random sibling
	*/
	pickRandomSibling (): Tile {
		var random = Math.floor(Math.random() * 4 + 1);
		switch (random) {
			case 1: {
				return this.leftSibling();
			}
			case 2: {
				return this.rightSibling();
			}
			case 3: {
				return this.topSibling();
			}
			case 4: {
				return this.bottomSibling();
			}
		}
	}
}