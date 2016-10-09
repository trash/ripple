import _ = require('lodash');
import {events} from '../events';
import {HoverDimensionsElement} from './hover-dimensions-element';
import {HoverElement} from './hover-element';
import {IDimensions, IRowColumnCoordinates, ICoordinates} from '../interfaces';
import {canvasService} from './canvas-service';
import {GameMap} from '../map';

let map: GameMap;

events.on('map-update', (map: GameMap) => {
	map = map;
});

let canvas,
	canvasOffset;

canvasService.on('canvas-set', () => {
	canvasOffset = canvasService.getCanvasOffset();
	canvas = canvasService.canvas;
});

// Gets the position relative to the canvas
let relativePosition: (x: number, y: number) => ICoordinates;

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
const getTilesAndDimensions = (startPosition: ICoordinates, endPosition: ICoordinates): {
	tiles: IRowColumnCoordinates[],
	dimensions: IDimensions
} => {
	var dimensions: IDimensions = {
			width: Math.abs(endPosition.x - startPosition.x),
			height: Math.abs(endPosition.y - startPosition.y),
		},
		base = _.clone(startPosition);

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
		tiles: map.getTilesBetween(startPosition, endPosition),
		dimensions: dimensions
	};
};

let selectBoxElement = new HoverElement(),
	dimensionsElement = new HoverDimensionsElement();

let drawSelectBox = function (dimensions: IDimensions) {
	map.setElementToTilePosition(selectBoxElement.element, map.getTile(dimensions.base.y, dimensions.base.x));

	// Update the text for the dimensions element
	dimensionsElement.setText(dimensions.width + 'x' + dimensions.height);
	map.setElementToTilePosition(dimensionsElement.element, map.getTile(dimensions.base.y, dimensions.base.x));

	var tileSize = map.scaledTileSize();

	// Expand its size
	selectBoxElement.element.style.width = dimensions.width * tileSize + 'px';
	selectBoxElement.element.style.height = dimensions.height * tileSize + 'px';
	dimensionsElement.element.style.width = dimensions.width * tileSize + 'px';
	dimensionsElement.element.style.height = dimensions.height * tileSize + 'px';
};


export function dragSelect (
	updateCallback: (tiles: IRowColumnCoordinates[], element: HTMLElement) => void,
	completeCallback: (tiles: IRowColumnCoordinates[], dimensions: IDimensions) => void,
	draw: boolean | string
): () => void {
	let dragEndPosition: ICoordinates;

	if (!relativePosition) {
		relativePosition = map.positionToTile.bind(map);
	}

	// Allow optional class to be given to select box
	if (typeof draw === 'string') {
		selectBoxElement.element.classList.add(draw);
	}

	var updateSelectBox = function (event) {
		// Stop it from highlighting the whole damn screen
		event.preventDefault();

		dragEndPosition = relativePosition(event.x, event.y);

		var tilesDimensions = getTilesAndDimensions(dragStartPosition, dragEndPosition);

		if (draw) {
			drawSelectBox(tilesDimensions.dimensions);
		}

		// Call the update callback with the current start/end positions
		updateCallback(tilesDimensions.tiles, selectBoxElement.element);
	};

	var dragEnd = function () {
		window.removeEventListener('mousemove', updateSelectBox);
		window.removeEventListener('mouseup', dragEnd);

		if (dragEndPosition) {
			var tilesAndDimensions = getTilesAndDimensions(dragStartPosition, dragEndPosition);

			// Call the complete function with the final start/end positions
			completeCallback(tilesAndDimensions.tiles, tilesAndDimensions.dimensions);
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

	var dragStartPosition = {
		x: null,
		y: null
	};
	// Drag start event
	var dragStart = function (event) {
		// Convert relative to canvas
		dragStartPosition = relativePosition(event.x, event.y);

		if (draw) {
			selectBoxElement.show();
			dimensionsElement.show();
			// Move the select box element to the click start
			map.setElementToTilePosition(
				selectBoxElement.element,
				map.getTile(dragStartPosition.y, dragStartPosition.x)
			);
			map.setElementToTilePosition(
				dimensionsElement.element,
				map.getTile(dragStartPosition.y, dragStartPosition.x)
			);
		}

		// Remove the start listener
		window.removeEventListener('mousedown', dragStart);

		// Add the update/end listeners
		window.addEventListener('mousemove', updateSelectBox);
		window.addEventListener('mouseup', dragEnd);
	};

	// Cancel and remove our click event listener
	var cancel = function () {
		this.emit('cancel');
		window.removeEventListener('mousedown', dragStart);
		// Remember to remove the optional class if it was added
		if (typeof draw === 'string') {
			selectBoxElement.element.classList.remove(draw);
		}
	};

	window.addEventListener('mousedown', dragStart);

	return cancel;
}