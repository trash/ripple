import * as _ from 'lodash';;
import {globalRefs} from '../globalRefs';
import {HoverDimensionsElement} from './hover-dimensions-element';
import {HoverElement} from './hover-element';
import {IDimensions, IRowColumnCoordinates, XYCoordinates} from '../interfaces';
import {canvasService} from './canvas-service';

let canvas;
let canvasOffset;

canvasService.on('canvas-set', () => {
	canvasOffset = canvasService.getCanvasOffset();
	canvas = canvasService.canvas;
});

// Gets the position relative to the canvas
const relativePosition = (x: number, y: number): XYCoordinates => {
	return globalRefs.map.positionToTile(x, y);
};

/**
 * Gets the tiles between the start and end position and the dimensions of the rectangle.
 *
 * @param {Tile} startPosition The start of the selected rectangle
 * @param {Tile} endPosition The end of the selected rectangle
 * @return {Object} selected
 * @return {Tiles[]} selected.tiles The selected tiles
 * @return {Object} selected.dimensions
 * @return {Number} selected.dimensions.width The width of the selected area in tiles
 * @return {Number} selected.dimensions.height The height of the selected area in tiles
 */
const getTilesAndDimensions = (startPosition: XYCoordinates, endPosition: XYCoordinates): {
	tiles: IRowColumnCoordinates[],
	dimensions: IDimensions
} => {
	const dimensions: IDimensions = {
		width: Math.abs(endPosition.x - startPosition.x),
		height: Math.abs(endPosition.y - startPosition.y),
	};
	const base = _.clone(startPosition);

	// Flip the x
	if (endPosition.x < startPosition.x) {
		base.x = endPosition.x;
	}
	// Flip the y
	if (endPosition.y < startPosition.y) {
		base.y = endPosition.y;
	}

	dimensions.base = base;

	return {
		tiles: globalRefs.map.getTilesBetween(startPosition, endPosition),
		dimensions: dimensions
	};
};

const selectBoxElement = new HoverElement();
const dimensionsElement = new HoverDimensionsElement();

const drawSelectBox = (dimensions: IDimensions) => {
	globalRefs.map.setElementToTilePosition(selectBoxElement.element, globalRefs.map.getTile(dimensions.base.y, dimensions.base.x));

	// Update the text for the dimensions element
	dimensionsElement.setText(dimensions.width + 'x' + dimensions.height);
	globalRefs.map.setElementToTilePosition(dimensionsElement.element, globalRefs.map.getTile(dimensions.base.y, dimensions.base.x));

	const tileSize = globalRefs.map.scaledTileSize();

	// Expand its size
	selectBoxElement.element.style.width = dimensions.width * tileSize + 'px';
	selectBoxElement.element.style.height = dimensions.height * tileSize + 'px';
	dimensionsElement.element.style.width = dimensions.width * tileSize + 'px';
	dimensionsElement.element.style.height = dimensions.height * tileSize + 'px';
};


export function dragSelect (
	updateCallback: (tiles: IRowColumnCoordinates[], element: HTMLElement) => void,
	compconsteCallback: (tiles: IRowColumnCoordinates[], dimensions: IDimensions) => void,
	draw: boolean | string
): () => void {
	let dragEndPosition: XYCoordinates;

	// Allow optional class to be given to select box
	if (typeof draw === 'string') {
		selectBoxElement.element.classList.add(draw);
	}

	const updateSelectBox = (event: MouseEvent) => {
		// Stop it from highlighting the whole damn screen
		event.preventDefault();

		dragEndPosition = relativePosition(event.x, event.y);

		const tilesDimensions = getTilesAndDimensions(dragStartPosition, dragEndPosition);

		if (draw) {
			drawSelectBox(tilesDimensions.dimensions);
		}

		// Call the update callback with the current start/end positions
		updateCallback(tilesDimensions.tiles, selectBoxElement.element);
	};

	const dragEnd = function () {
		window.removeEventListener('mousemove', updateSelectBox);
		window.removeEventListener('mouseup', dragEnd);

		if (dragEndPosition) {
			const tilesAndDimensions = getTilesAndDimensions(dragStartPosition, dragEndPosition);

			// Call the compconste function with the final start/end positions
			compconsteCallback(tilesAndDimensions.tiles, tilesAndDimensions.dimensions);
		}

		// The drag start listener again so they can keep calling this until cancel is called
		window.addEventListener('mousedown', dragStart);

		// Clear the values
		dragStartPosition = null;
		dragEndPosition = null;

		if (draw) {
			selectBoxElement.hide();
			dimensionsElement.hide();
		}
	};

	let dragStartPosition = {
		x: null,
		y: null
	};
	// Drag start event
	const dragStart = (event: MouseEvent) => {
		// Convert relative to canvas
		dragStartPosition = relativePosition(event.x, event.y);

		if (draw) {
			selectBoxElement.show();
			dimensionsElement.show();
			// Move the select box element to the click start
			globalRefs.map.setElementToTilePosition(
				selectBoxElement.element,
				globalRefs.map.getTile(dragStartPosition.y, dragStartPosition.x)
			);
			globalRefs.map.setElementToTilePosition(
				dimensionsElement.element,
				globalRefs.map.getTile(dragStartPosition.y, dragStartPosition.x)
			);
		}

		// Remove the start listener
		window.removeEventListener('mousedown', dragStart);

		// Add the update/end listeners
		window.addEventListener('mousemove', updateSelectBox);
		window.addEventListener('mouseup', dragEnd);
	};

	// Cancel and remove our click event listener
	const cancel = () => {
		window.removeEventListener('mousedown', dragStart);
		// Remember to remove the optional class if it was added
		if (typeof draw === 'string') {
			selectBoxElement.element.classList.remove(draw);
		}
	};

	window.addEventListener('mousedown', dragStart);

	return cancel;
}