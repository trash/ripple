import {constants} from './data/constants';
import {events} from './events';
import {
	XYCoordinates,
	TilemapData,
	LayerData,
	CameraView
} from './interfaces';
import {PixelateFilter} from 'pixi-filters';
import {SpriteManager} from './services/spriteManager';

const tileSize = constants.TILE_HEIGHT;
const defaultSubContainerLayer = 1;

export class SubContainer extends PIXI.Container {
	subX: number;
	subY: number;
	children: SubContainerLayer[];
	shouldBeRendered: boolean;
}

export class SubContainerLayer extends PIXI.Container {
	index: number;
	rows: TilemapSprite[][];

	constructor(index) {
		super();
		this.index = index;
	}
}

export interface TilemapSprite extends PIXI.Sprite {
	subContainer: number;
	row: number;
	destroyed: boolean;
}

export class Tilemap extends PIXI.Container {
	scaleFactor: number;
	renderer: PIXI.WebGLRenderer;
	dimension: number;
	subContainerDimension: number;
	subContainerLayerCount: number;
	subContainersCount: number;
	subContainers: SubContainer[];
	test: boolean;
	hoverLayer: PIXI.Container;
	filters: PIXI.Filter[];
	lastRenderList: boolean[];
	children: PIXI.Container[];
	subContainerDebugRectangles: PIXI.Graphics[];

	constructor (
		data: TilemapData,
		renderer: PIXI.WebGLRenderer,
		test: boolean = false
	) {
		super();

		this.renderer = renderer;

		this.dimension = data.layers[0].width;

		this.subContainerDimension = constants.SUBCONTAINER_SIZE;

		const subContainersCount = (this.dimension * this.dimension)
			/ (this.subContainerDimension * this.subContainerDimension);
		this.subContainersCount = subContainersCount;
		this.subContainers = [];

		this.subContainerDebugRectangles = [];

		let i;

		for (i=0; i < subContainersCount; i++) {
			const subContainer = new SubContainer();

			// Mark their position in the grid of subcontainers
			subContainer.subX = (i % Math.sqrt(subContainersCount));
			subContainer.subY = Math.floor(i / Math.sqrt(subContainersCount));

			// Position them properly
			subContainer.position.x = subContainer.subX
				* this.subContainerDimension * tileSize;
			subContainer.position.y = subContainer.subY
				* this.subContainerDimension * tileSize;

			this.addChild(subContainer);
			this.subContainers.push(subContainer);
		}

		this.test = test;

		this.scaleFactor = 1;

		this.subContainerLayerCount = 2;

		// Load the initial layers of sprites
		data.layers.forEach((layer, index) =>
			this.addBackgroundSpriteFromLayerData(layer, index)
		);

		// Add the third layer for each sub container
		this.subContainers.forEach((subContainer, index) => {
			for (i = 0; i < this.subContainerLayerCount; i++) {
				const layer = new SubContainerLayer(
					index * this.subContainerLayerCount + i
				);

				layer.rows = [];

				// Most of them will be empty but eh i'm lazy
				for (let j = 0; j < this.dimension; j++) {
					layer.rows[j] = [];
				}

				subContainer.addChild(layer);
			}
		});

		this.hoverLayer = new PIXI.Container();
		this.addChild(this.hoverLayer);

		// this.toggleFilters();
		events.on('toggle-tilemap-debug', (on: boolean) => this.debug(on));
	}

	/**
	 * Toggle drawing rectangles on the screen showing each subcontainer'scale
	 * dimensions.
	 * Also creates the rectangles the first time it's called with on = true;
	 */
	debug(on: boolean) {
		if (on) {
			// Create them
			if (!this.subContainerDebugRectangles.length) {
				const dimension = this.subContainerDimension * constants.TILE_HEIGHT;
				this.subContainers.forEach(subContainer => {
					const graphics = new PIXI.Graphics();
					graphics.lineStyle(2, 0xFF0000);
					graphics.drawRect(
						subContainer.subX * dimension,
						subContainer.subY * dimension,
						dimension,
						dimension
					);
					this.subContainerDebugRectangles.push(graphics);
					this.addChild(graphics);
				});
			}
			// Show them
			this.subContainerDebugRectangles.forEach(rect => rect.visible = true);
		} else {
			// Hide them
			this.subContainerDebugRectangles.forEach(rect => rect.visible = false);
		}
	}

	toggleFilters () {
		if (this.filters) {
			this.filters = null;
			return;
		}

		let pixelateFilter = new PixelateFilter();
		pixelateFilter.size.x = pixelateFilter.size.y = 4;

		let sepiaFilter = new PIXI.filters.ColorMatrixFilter();
		sepiaFilter.sepia();// = 0.7;

		// let colorStepFilter = new PIXI.filters.ColorStepFilter();
		// colorStepFilter.step = 2.5;
		// colorStepFilter.step = 3.5; // dusk

		this.filters = [sepiaFilter];
	};

	addBackgroundSpriteFromLayerData (
		layerData: LayerData,
		childIndex: number
	) {
		const layer = new PIXI.Container();
		for (let i = 0; i < this.dimension; i++) {
			for (let j = 0; j < this.dimension; j++) {
				const index = i * this.dimension + j;
				const sprite = this.getSprite(layerData.data[index]);
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
		const texture = PIXI.RenderTexture.create(
			this.dimension * tileSize,
			this.dimension * tileSize
		);
		texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
		this.renderer.render(layer, texture);

		// Write the render texture to a sprite and add it to the the tilemap
		const background = new PIXI.Sprite(texture);
		this.addChildAt(background, childIndex);
	};

	_getDimension () {
		return Math.sqrt(this.subContainersCount)
			* this.subContainerDimension
			* tileSize;
	}
	getWidth () {
		return this._getDimension();
	}
	getHeight () {
		return this._getDimension();
	}

	updateView (
		view: CameraView
	) {
		// Unit is the size of one container in pixels
		const unit = (this.subContainerDimension * tileSize);
		// Compute the boundaries based on this unit
		const startX = Math.floor(view.x / unit);
		const startY = Math.floor(view.y / unit);
		const endX = Math.ceil(startX + (view.width / unit));
		const endY = Math.ceil(startY + (view.height / unit));

		// Go through the subcontainers and mark the ones that should be rendered
		this.subContainers.forEach(subContainer => {
			// It's in the bounds of the view box
			subContainer.shouldBeRendered =
				(subContainer.subX >= startX && subContainer.subX <= endX)
				&& (subContainer.subY >= startY && subContainer.subY <= endY);
		});

		const currentRenderList = this.subContainers.map(subContainer => {
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

			// Make sure the hover layer is always the last child
			this.removeChild(this.hoverLayer);
			this.addChild(this.hoverLayer);
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

	getSprite (frame: string) {
		if (this.test) {
			return new PIXI.Sprite();
		}
		return 	SpriteManager.Sprite.fromFrame(frame);
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
		dontUpdatePosition: boolean = false,
		oldSubContainerIndex?: number
	) {
		const subContainerIndex = this.tileToSubContainerIndex(x, y);
		const subContainer = this.subContainers[subContainerIndex];
		const layer = subContainer.children[layerIndex];

		// Need to account for variable length of previous rows
		const previousRowsTotal = layer.rows
			.slice(0, y)
			.reduce((previous, next) => {
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

	removeChildFromSubContainer (
		sprite: TilemapSprite,
		layerIndex: number = defaultSubContainerLayer
	) {
		const previousSubContainer = this.subContainers[sprite.subContainer];
		const layer = previousSubContainer.children[layerIndex];
		const index = layer.children.indexOf(sprite);
		const row = layer.rows[sprite.row];
		const indexInRow = row.indexOf(sprite);

		if (indexInRow === -1) {
			debugger;
		}

		// Remove the sprite from the subContainer's rows
		layer.rows[sprite.row].splice(indexInRow, 1);
		// Remove the sprite from the subContainer's layer's children list
		previousSubContainer.children[layerIndex].children.splice(index, 1);

		return sprite.subContainer;
	}

	positionFromTile (
		column: number,
		row: number
	): XYCoordinates {
		// Need to make them relative to the subcontainer using modulo operator
		return {
			x: tileSize * (column % this.subContainerDimension) * this.scaleFactor,
			y: tileSize * (row % this.subContainerDimension) * this.scaleFactor
		};
	}

	setSpritePositionFromTile (
		sprite: PIXI.DisplayObject,
		column: number,
		row: number
	) {
		const position = this.positionFromTile(column, row);
		// Need to make them relative to the subcontainer using modulo operator
		sprite.position.x = position.x;
		sprite.position.y = position.y;
	}

	/**
	 * Returns true if the new position will result in the subcontainer being changed
	 */
	subContainerWillUpdate (
		sprite: TilemapSprite,
		x: number,
		y: number
	): boolean {
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
		const currentSubContainerIndex = sprite.subContainer;
		const nextSubContainerIndex = this.tileToSubContainerIndex(x, y);
		if (currentSubContainerIndex === nextSubContainerIndex) {
			return true;
		}

		const oldSubContainerIndex = this.removeChildFromSubContainer(
			sprite,
			layerIndex
		);
		const newSubContainerIndex = this.addChildToPosition(
			sprite,
			x,
			y,
			layerIndex,
			dontUpdatePosition,
			oldSubContainerIndex
		);

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