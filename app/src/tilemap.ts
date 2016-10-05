import {constants} from './data/constants';
import {ICoordinates, ITilemapData} from './interfaces';

const tileSize = constants.TILE_HEIGHT,
	defaultSubContainerLayer = 1;

export class SubContainer extends PIXI.Container {
	subX: number;
	subY: number;
	children: SubContainerLayer[];
	shouldBeRendered: boolean;
}

export class SubContainerLayer extends PIXI.Container {
	rows: TilemapSprite[][];
}

export interface TilemapSprite extends PIXI.Sprite {
	subContainer: number;
	row: number;
	destroyed: boolean;
}

export class Tilemap extends PIXI.Container {
	scaleFactor: number;
	renderer: any;
	dimension: number;
	subContainerDimension: number;
	subContainerLayerCount: number;
	subContainersCount: number;
	subContainers: SubContainer[];
	test: boolean;
	hoverLayer: any;
	filters: any;
	lastRenderList: any[];
	finalLayer: any;
	children: PIXI.Container[];

	constructor (
		data: ITilemapData,
		renderer: PIXI.WebGLRenderer,
		test: boolean = false
	) {
		super();
		console.log(data.layers[0].data.indexOf('full-grass'));

		this.renderer = renderer;

		this.dimension = data.layers[0].width;

		this.subContainerDimension = 20;

		var subContainersCount = (this.dimension * this.dimension) / (this.subContainerDimension * this.subContainerDimension);
		this.subContainersCount = subContainersCount;
		this.subContainers = [];

		var i;

		for (i=0; i < subContainersCount; i++) {
			var subContainer = new SubContainer();

			// Mark their position in the grid of subcontainers
			subContainer.subX = (i % Math.sqrt(subContainersCount));
			subContainer.subY = Math.floor(i / Math.sqrt(subContainersCount));

			// Position them properly
			subContainer.position.x = subContainer.subX * this.subContainerDimension * tileSize;
			subContainer.position.y = subContainer.subY * this.subContainerDimension * tileSize;

			this.addChild(subContainer);
			this.subContainers.push(subContainer);
		}

		this.test = test;

		this.scaleFactor = 1;

		this.subContainerLayerCount = 2;

		// Load the initial layers of sprites
		data.layers.forEach(this.addBackgroundSpriteFromLayerData.bind(this));

		// Add the third layer for each sub container
		this.subContainers.forEach(subContainer => {
			for (var i=0; i < this.subContainerLayerCount; i++) {
				var layer = new SubContainerLayer();

				layer.rows = [];

				// Most of them will be empty but eh i'm lazy
				for (var j=0; j < this.dimension; j++) {
					layer.rows[j] = [];
				}

				subContainer.addChild(layer);
			}
		});

		this.hoverLayer = new PIXI.Container();
		this.addChild(this.hoverLayer);

		// this.toggleFilters();
	}

	toggleFilters () {
		if (this.filters) {
			this.filters = null;
			return;
		}

		let pixelateFilter = new PIXI.filters.PixelateFilter();
		pixelateFilter.size.x = pixelateFilter.size.y = 4;

		let sepiaFilter = new PIXI.filters.SepiaFilter();
		sepiaFilter.sepia = 0.7;

		let colorStepFilter = new PIXI.filters.ColorStepFilter();
		colorStepFilter.step = 2.5;
		// colorStepFilter.step = 3.5; // dusk

		this.filters = [sepiaFilter, colorStepFilter];
	};

	addBackgroundSpriteFromLayerData (layerData, childIndex) {
		var layer = new PIXI.Container();
		for (var i=0; i < this.dimension; i++) {
			for (var j=0; j < this.dimension; j++) {
				var index = i*this.dimension + j,
					sprite = this.getSprite(layerData.data[index]);
				sprite.position.x = j * tileSize;
				sprite.position.y = i * tileSize;
				// Need to offset some of the grass tiles because they're 24x44
				if (sprite.height > tileSize) {
					sprite.position.y -= sprite.height - tileSize;
				}
				layer.addChildAt(sprite, index);
			}
		}

		// Render each background layer as a render texture
		var texture = new PIXI.RenderTexture(this.renderer, this.dimension * tileSize, this.dimension * tileSize);
		texture.render(layer);

		// Write the render texture to a sprite and add it to the the tilemap
		var background = new PIXI.Sprite(texture);
		this.addChildAt(background, childIndex);
	};

	_getDimension () {
		return Math.sqrt(this.subContainersCount) * this.subContainerDimension * tileSize;
	}
	getWidth () {
		return this._getDimension();
	}
	getHeight () {
		return this._getDimension();
	}

	updateView (view) {
		// Unit is the size of one container in pixels
		var unit = (this.subContainerDimension * tileSize),
		// Compute the boundaries based on this unit
			startX = Math.floor(view.x / unit),
			startY = Math.floor(view.y / unit),
			endX = Math.ceil(startX + (view.width / unit)),
			endY = Math.ceil(startY + (view.height / unit));

		// Go through the subcontainers and mark the ones that should be rendered
		this.subContainers.forEach(subContainer => {
			// It's in the bounds of the view box
			subContainer.shouldBeRendered = ((subContainer.subX >= startX && subContainer.subX <= endX)
				&& subContainer.subY >= startY && subContainer.subY <= endY);
		});

		var currentRenderList = this.subContainers.map(subContainer => {
			return subContainer.shouldBeRendered;
		});

		// We need to update the displayed containers
		if (!currentRenderList.equals(this.lastRenderList)) {
			// this.removeChildren();
			this.subContainers.forEach(subContainer => {
				if (subContainer.shouldBeRendered) {
					this.addChildAt(subContainer, this.children.length);
				} else if (subContainer.parent) {
					subContainer.parent.removeChild(subContainer);
				}
			});
		}

		this.lastRenderList = currentRenderList;
	}

	/**
	 * Given x,y coords, return the index of the matching sub container
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Number} Index of this.subContainers corresponding to the subContainer
	 */
	positionToSubContainerIndex (x: number, y: number) {
		x = Math.floor(x / tileSize / this.subContainerDimension);
		y = Math.floor(y / tileSize / this.subContainerDimension);

		return y * Math.sqrt(this.subContainersCount) + x;
	}

	/**
	 * Given x,y coords, return the index of the matching sub container
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Number} Index of this.subContainers corresponding to the subContainer
	 */
	tileToSubContainerIndex (x: number, y: number) {
		x = Math.floor(x / this.subContainerDimension);
		y = Math.floor(y / this.subContainerDimension);

		return y * Math.sqrt(this.subContainersCount) + x;
	}

	getSprite (frame) {
		if (this.test) {
			return new PIXI.Sprite();
		}
		return 	PIXI.Sprite.fromFrame(frame);
	}

	/**
	 * Add a child sprite to the end of a row
	 * Accounts for variable length of preceding rows so that this child is rendered
	 * in front of all previous rows
	 *
	 * @param {[type]} sprite [description]
	 * @param {[type]} rowIndex [description]
	 */
	addChildToPosition (
		sprite: TilemapSprite,
		x: number,
		y: number,
		layerIndex: number = defaultSubContainerLayer,
		dontUpdatePosition: boolean = false
	) {
		var subContainerIndex = this.tileToSubContainerIndex(x, y),
			subContainer = this.subContainers[subContainerIndex],
			layer = subContainer.children[layerIndex];

		// Need to account for variable length of previous rows
		const previousRowsTotal = layer.rows.slice(0, y).reduce((previous, next) => {
			return previous + next.length;
		}, 0);

		const lastChildIndex = layer.rows[y].length + previousRowsTotal;
		// Store the current row and subContainer
		sprite.row = y;
		sprite.subContainer = subContainerIndex;

		layer.addChildAt(sprite, lastChildIndex);

		layer.rows[y].push(sprite);

		// Set the sprites position to the tile
		if (!dontUpdatePosition) {
			this.setSpritePositionFromTile(sprite, x, y);
		}

		return subContainerIndex;
	}

	/**
	 * Returns the index of the sprite in the finalLayer
	 *
	 * @param {PIXI.Sprite} sprite Sprite to get index of
	 * @return {Number} the index
	 */
	getChildIndex (sprite: PIXI.DisplayObject) {
		return this.finalLayer.getChildIndex(sprite);
	}

	removeChildFromSubContainer (sprite, layerIndex: number = defaultSubContainerLayer) {
		const previousSubContainer = this.subContainers[sprite.subContainer],
			layer = previousSubContainer.children[layerIndex],
			index = layer.children.indexOf(sprite),
			row = layer.rows[sprite.row],
			indexInRow = row.indexOf(sprite);

		if (indexInRow === -1) {
			debugger;
		}

		// Remove the sprite from the subContainer's rows
		layer.rows[sprite.row].splice(indexInRow, 1);
		// Remove the sprite from the subContainer's layer's children list
		previousSubContainer.children[layerIndex].children.splice(index, 1);

		return sprite.subContainer;
	}

	positionFromTile (column: number, row: number): ICoordinates {
		// Need to make them relative to the subcontainer using modulo operator
		return {
			x: tileSize * (column % this.subContainerDimension) * this.scaleFactor,
			y: tileSize * (row % this.subContainerDimension) * this.scaleFactor
		};
	}

	setSpritePositionFromTile (sprite: PIXI.DisplayObject, column: number, row: number) {
		var position = this.positionFromTile(column, row);
		// Need to make them relative to the subcontainer using modulo operator
		sprite.position.x = position.x;
		sprite.position.y = position.y;
	}

	/**
	 * Returns true if the new position will result in the subcontainer being changed
	 */
	subContainerWillUpdate (sprite: TilemapSprite, x: number, y: number): boolean {
		const newSubContainerIndex = this.tileToSubContainerIndex(x, y);
		return newSubContainerIndex !== sprite.subContainer;
	}

	/**
	 * Change the child sprites row.
	 * Removes it from its row and from the children and then calls addChildToRow
	 * with the new row
	 *
	 * @param {[type]} sprite [description]
	 * @param {Number} x Column
	 * @param {Number} y Row
	 * @param {Boolean} [dontUpdatePosition] Whether or not to update the sprite's position as well
	 * @returns {Boolean} Whether or not the sprite switched subcontainers
	 */
	changeChildPosition (
		sprite: TilemapSprite,
		x: number,
		y: number,
		dontUpdatePosition: boolean,
		layerIndex: number = defaultSubContainerLayer,
	): boolean {
		const oldSubContainerIndex = this.removeChildFromSubContainer(sprite, layerIndex),
			newSubContainerIndex = this.addChildToPosition(sprite, x, y, layerIndex, dontUpdatePosition);

		// Whether it was an actual update
		return oldSubContainerIndex !== newSubContainerIndex;
	}

	getTileSize (): number {
		return this.scaleFactor * tileSize;
	}

	setScale (scale: number) {
		this.children.forEach(layer => {
			layer.children.forEach(sprite => {
				// this might not work?
				sprite.scale.x = scale;
				sprite.scale.y = scale;
				sprite.position.x = sprite.position.x / this.scaleFactor * scale;
				sprite.position.y = sprite.position.y / this.scaleFactor * scale;
			});
		});
		this.scaleFactor = scale;
	}
}