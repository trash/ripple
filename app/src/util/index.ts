import * as _ from 'lodash';;
import {constants} from '../data/constants';
import {MapTile} from '../map/tile';
import {MapGenTile} from '../map/map-gen-tile';
import {INearestTile, ICoordinates, IRowColumnCoordinates} from '../interfaces';
import {IPositionState} from '../entity/components/position';
import {Components} from '../entity/ComponentsEnum';
import {positionUtil} from '../entity/util';
import {Tick} from '../b3/Core';

// This is 1 minute of real time at regular speed
var ticksPerHour = constants.TICKS_PER_HOUR;

/**
 * Returns an instance of a valid tiles filter based on the given filter condition
 *
 * @param {Function} checkFunction Should return true if the tile is valid
 * @return {Function} Returns the filter function
 */
const validTilesCheck = (checkFunction: (tile: MapGenTile) => boolean) => {
	return (tiles: MapGenTile[]) => {
		return tiles.filter(tile => checkFunction(tile));
	};
};

const defaultValidTilesCheck = validTilesCheck(tile =>
	tile.accessible
);

export class Util {
	canvas: any;

	/**
	 * Helper to filter a set of tiles down to valid ones for placing a farm
	 *
	 * @todo  figure way to attach this to map maybe? might not work because circular deps
	 *
	 * @param {Tile[]} tiles The tiles to check
	 * @return {Boolean} The subset of tiles that are valid
	 */
	static validTiles = {
		resource: defaultValidTilesCheck
	};

	saveToFile (data) {
		var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
		window.open(url, '_blank');
	}

	// http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
	shadeColor (color, percent) {
		if (color.match('0x')) {
			color = color.slice(2);
		}
		const f = parseInt(color.slice(1), 16),
			t = percent < 0 ? 0 : 255,
			p = percent < 0 ? percent * -1 : percent,
			R = f>>16,
			G = f>>8&0x00FF,
			B = f&0x0000FF;
		let shaded = '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 +
			(Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
		shaded = '0x' + shaded.slice(1).toUpperCase();
		return shaded;
	}

	/**
	 * Wrapper for Number.prototype.toPrecision that handles
	 * strings and other non-Numbers
	 *
	 * @param {Object} number A number presumably
	 * @param {Number} precision Digits of precision desired
	 * @return {Number} Number with desired digits of precision or 0
	 */
	toPrecision (number: any, precision: number): number {
		// Handle strings, null
		number = Number(number);
		// Precision is only for numbers 1-21
		if (precision === 0) {
			return Math.floor(number);
		}
		return number.toPrecision(precision);
	}

	getTextWidth (text: string, font: string): number {
		// re-use canvas object for better performance
		let canvas = this.canvas || (this.canvas = document.createElement('canvas')),
			context = canvas.getContext('2d');
		context.font = font;
		let metrics = context.measureText(text);
		return metrics.width;
	}

	shuffle<T> (array: T[]): T[] {
		var currentIndex = array.length, temporaryValue, randomIndex ;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	/**
	 * Finds the nearest tile from a list of tiles from a single tile.
	 *
	 * @param {Tile[]} tiles The tiles from which to select the one of the shortest distance
	 * @param {Tile} start The tile to determine the shorest distance from
	 * @return {Tile} The nearest tile from the start tile
	 */
	nearestTile (tiles: any[], start: any): INearestTile {
		var nearest = {
			distance: Number.MAX_VALUE,
			tile: null
		};

		for (var i=0; i < tiles.length; i++) {
			var distance = tiles[i].distanceTo(start);
			if (distance < nearest.distance) {
				nearest.tile = tiles[i];
				nearest.distance = distance;
			}
		}
		return nearest;
	}

	/**
	 * Processes a map of options against required ones and default ones.
	 * Validates required ones and logs an error if they're missing.
	 * Returns the merged options with defaults.
	 *
	 * @param {Object} options
	 * @param {Object} defaultOptions
	 * @param {Object} requiredOptions
	 * @return {Object} Merged options
	 */
	processOptions (options, defaultOptions, requiredOptions) {
		options = options || {};
		defaultOptions = defaultOptions || {};

		// Validate required options
		if (requiredOptions) {
			for (var option in requiredOptions) {
				// Depends on another option being defined
				if (typeof requiredOptions[option] === 'string') {
					let dependency = requiredOptions[option];
					if (!(option in options) && !(dependency in options)) {
						this.error(`Missing required option with (dependency): ${option} (${dependency})`);
					}
				} else if (!(option in options)) {
					this.error(`Missing required option: ${option}`);
				}
			}
		}

		return _.extend({}, defaultOptions, options);
	}

	error (errorMessage: string) {
		throw new Error(errorMessage);
	}

	/**
	 * Space out a list of strings and return it as a single string.
	 *
	 * @param {String[]} strings The list of strings to add together with spaces.
	 */
	addSpaces (strings: string[]): string {
		var spacedString = '';
		strings.forEach(function (string) {
			spacedString += string + ' ';
		});
		return spacedString;
	}

	toComponent (n: number): string {
		return n.toString(16);
	}

	rgbToHex (r: number, g: number, b: number): string {
		return '#' + this.toComponent(r) + this.toComponent(g) + this.toComponent(b);
	}

	noop () {}

	randomFromList<T> (list: T[]): T {
		return list[Math.floor(Math.random() * list.length)];
	}

	bound (
		value: number,
		lower: number,
		upper: number
	): number {
		if (value < lower) {
			return lower;
		} else if (value > upper) {
			return upper;
		}
		return value;
	}

	/**
	 * Returns a random integer in between the given upper and lower bounds.
	 * Pass a single argument if you just want the lower bound to be 0
	 *
	 * Defaults to be inclusive to the upper bound.
	 * Pass inclusive: false to make this not be the case
	 *
	 * @param {Number} lower Lower bounds
	 * @param {Number} upper Upper bound
	 * @return {Number} An integer between lower and upper
	 */
	randomInRange (lower: number, upper?: number, float:  boolean = false,
		inclusive: boolean = true): number
	{
		if (arguments.length === 1) {
			upper = lower;
			lower = 0;
		}
		let boundAdd = inclusive ? 1 : 0;
		var value = Math.random() * ((upper + boundAdd) - lower) + lower;
		if (!float) {
			value = Math.floor(value);
		}
		return value;
	}

	/**
	 * Takes a map of keys and their comparitive ratios and produces a
	 * chance map, a list that when an element is randomly selected from it
	 * will return an item with a frequency corresponding to the ratio
	 *
	 * @param {Object} ratios Ratio map
	 * @return {String[]} List of keys, the chance map
	 */
	ratiosToChanceMap (ratios: any): string[] {
		var map = [];

		for (const key in ratios) {
			const count = ratios[key];
			for (let i=0; i < count; i++) {
				map.push(key);
			}
		}

		return map;
	}

	/**
	 * Given a map of ratios, returns a random key with a chance determined by the ratios
	 *
	 * @param {Object} ratios Map of keys with ratios
	 * @return {String} The random key chosen
	 */
	randomFromRatios (ratios: any): string {
		var map = this.ratiosToChanceMap(ratios);
		return map[Math.floor(Math.random() * map.length)];
	}

	// Either returns -1 or 1
	randomPositiveNegative (): number {
		// Allow single argument with default lower bound of 0
		var random = Math.random();
		if (random < 0.5) {
			return -1;
		}
		return 1;
	}

	/**
	 * Given a list of values, and a target value,
	 * finds the spot where the given value would fit in between.
	 * It return the index of the element that the target is
	 * greater than or equal to
	 *
	 * @example
	 * var list = [0, 2, 5, 7, 10];
	 *
	 * util.getIndexInRange(list, 3);
	 * // 1
	 * // This is because 3 is greater than 2 and less than 5
	 *
	 * @param {Array} list Array of comparable values to value
	 * @param {*} value The value of the same comparable type as the elems in list to find the index
	 * @return {Number} The index
	 */
	getIndexInRange (list: any[], value: any): number {
		var index;

		for (var i=0; i < list.length; i++) {
			var current = list[i],
				next = list[i+1];

			if (value === current) {
				index = i;
			} else if (value === next || value > current && value < next) {
				index = i+1;
			}

			if (index !== undefined) {
				return index;
			}
		}
		// Just return the last one if it's out of bounds
		return list.length-1;
	};

	/**
	 * Converts a given number of ingame hours into the proper amount of clock ticks
	 *
	 * @param {Number} hours The amount of hours
	 * @return {Number} The amount of ticks
	 */
	hoursToTicks (hours: number): number {
		return ticksPerHour * hours;
	}

	/**
	 * Capitalizes a single word or a string with multiple words (capitalizes each word
	 * )
	 * @param {String} string String to capitalize each of words for
	 * @return {String} String with part(s) capitalized
	 */
	capitalize (string: string): string {
		var parts = string.split(' ');
		if (parts.length > 1) {
			var capitalizedString = '';
			parts.forEach(word => {
				capitalizedString += this.capitalize(word) + ' ';
			});
			return capitalizedString.slice(0, capitalizedString.length-1);
		}
		return string[0].toUpperCase() + string.slice(1);
	}

	/**
	 * Takes a list of items and returns a string like this 'wood (10), iron (20)'
	 *
	 * @param {Object[]} itemList
	 * @return {[type]} [description]
	 */
	// itemListString (itemList: number[], toBeStored: boolean): string {
	// 	var map = {},
	// 		toBeStoredMap = {};
	// 	itemList.forEach(item => {
	// 		if (!map[item.name]) {
	// 			map[item.name] = 0;
	// 			toBeStoredMap[item.name] = 0;
	// 		}
	// 		map[item.name]++;
	// 		if (item.toBeStored) {
	// 			toBeStoredMap[item.name]++;
	// 		}
	// 	});
	// 	var returnString = '';
	// 	Object.keys(map).forEach(name => {
	// 		let fragment = `${name} (${map[name]}`;
	// 		if (toBeStored && toBeStoredMap[name]) {
	// 			fragment += `; not yet stored: ${ toBeStoredMap[name] }`;
	// 		}
	// 		fragment += ') ';
	// 		returnString += fragment;
	// 	});
	// 	return returnString;
	// }

	itemsToList (list: any[]): string[] {
		let totals = {};
		list.forEach(item => {
			if (!(item.name in totals)) {
				totals[item.name] = 0;
			}
			totals[item.name]++;
		});
		let newList = [];
		for (let itemName in totals) {
			newList.push(itemName + '*' + totals[itemName]);
		}
		return newList;
	}

	/**
	 * Returns an object if it is one otherwise fetches the object
	 * off the blackboard
	 *
	 * @param {Object} tick b3 tick
	 * @param {String|Object} targetOrKey Key corresponding to blackboard value or object
	 * @return {Object}
	 */
	targetOrKey (tick, targetOrKey) {
		var target;
		if (typeof targetOrKey === 'string') {
			target = this.blackboardGet(tick, targetOrKey);
		} else {
			target = targetOrKey;
		}
		return target;
	}

	/**
	 * Wrapper for targetOrKey that optionally takes a function
	 * that can be resolved to a targetOrKey value.
	 *
	 * @param {Object} tick b3 tick
	 * @param {String|Object|Function} targetOrKey Key corresponding to blackboard value or object
	 * @return {Object}
	 */
	targetKeyOrFunction (tick: Tick, targetKeyOrFunction: string | Function) {
		let targetOrKey = targetKeyOrFunction;
		if (targetKeyOrFunction instanceof Function) {
			targetOrKey = targetKeyOrFunction(tick);
		}
		return this.targetOrKey(tick, targetOrKey);
	}

	blackboardGet (tick: Tick, blackboardKey: string, nodeScope?: string) {
		return tick.blackboard.get(
			`${blackboardKey}:${tick.target.id}`, tick.tree.id, nodeScope);
	}

	blackboardSet (tick: Tick, blackboardKey: string, value: any, nodeScope?: string) {
		return tick.blackboard.set(
			`${blackboardKey}:${tick.target.id}`, value, tick.tree.id, nodeScope);
	}

	setTile (
		positionState: IPositionState,
		tile: IRowColumnCoordinates,
		turn: number,
		speed: number
	) {
		positionState.previousTile = positionState.tile;
		positionState.tile = tile;
		positionState.turnUpdated = turn;
		positionState.turnCompleted = turn + speed;
	}


	rowColumnCoordinatesAreEqual (
		coord1: IRowColumnCoordinates,
		coord2: IRowColumnCoordinates
	): boolean {
		return coord1.row === coord2.row && coord1.column === coord2.column;
	}

	coordinatesAreEqual (
		coord1: ICoordinates,
		coord2: ICoordinates
	): boolean {
		return coord1.x === coord2.x && coord1.y === coord2.y;
	}
}

export let util = new Util();