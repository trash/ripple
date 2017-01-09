import {constants} from '../data/constants';
import {events} from '../events';
import {util} from '../util'

import {store} from '../redux/store';
import {updateClockTime} from '../redux/actions/update-clock-time';

const hoursToTicks = util.hoursToTicks;

// This is 1 minute of real time at regular speed
const ticksPerHour = constants.TICKS_PER_HOUR;

 /**
  * Creates a new GameClock object.
  *
  * @classdesc A game clock in charge of keeping track of how much in game time has passed.
  *
  * @constructor
 */
export class GameClock {
	ticks: number;
	hours: number;
	days: number;
	ticksToHour: number;
	callbacks: any;

	constructor () {
		this.reset();
	}

	reset () {
		this.ticks = 0;

		this.ticksToHour = 0;

		this.callbacks = {};

		this.updateHour(0);
		this.updateDay(1);
	};

	load (saveData: any) {
		this.ticks = saveData.ticks;
		this.setTime(saveData.days, saveData.hours);
	};

	serialize (): { ticks: number, hours: number, days: number } {
		return {
			ticks: this.ticks,
			hours: this.hours,
			days: this.days
		};
	};

	setTime (days: number, hours: number) {
		this.updateDay(days);
		this.updateHour(hours);
	};

	/**
	 * Increments ticks
	 * Increments hour after the required amount of ticks per hour passes
	 */
	update () {
		this.ticks++;
		this.ticksToHour++;

		// Check if an hour has passed
		if (this.ticksToHour === ticksPerHour) {
			this.incrementHour();
			this.ticksToHour = 0;
		}

		this.checkCallbacks();
	};

	/**
	 * Add a callback to the list of callbacks for the given tick
	 * Initializes empty list for tick if it doesn't already exist
	 *
	 * @param {Number} tick Tick to call the callback
	 * @param {Function} callback
	 */
	addTimerCallback (tick: number, callback: () => void) {
		var existing = this.callbacks[tick];
		if (!existing) {
			this.callbacks[tick] = [];
		}
		this.callbacks[tick].push(callback);

		// Remove a callback
		return () => {
			var callbacks = this.callbacks[tick];
			if (!callbacks) {
				debugger;
			}
			var index = callbacks.indexOf(callback);
			if (index === -1) {
				debugger;
			}
			callbacks.splice(index, 1);
			this.callbacks[tick] = callbacks;
		};
	};

	/**
	 * Calls any callbacks for the given tick
	 */
	checkCallbacks () {
		var callbacks = this.callbacks[this.ticks];

		// If we got callbacks call them then get rid of them
		if (callbacks) {
			callbacks.forEach(function (callback) {
				callback();
			});
			// Get rid of them
			delete this.callbacks[this.ticks];
		}
	};

	updateHour (value: number) {
		this.hours = value;

		if (this.hours === 24) {
			this.updateHour(0);
			this.incrementDay();
		} else {
			events.emit(['clock', 'hour'], this.hours);
			store.dispatch(updateClockTime(this.hours, this.days));
		}
	};

	/**
	 * Increments the game clock by one hour
	 * Increments day after 24
	 */
	incrementHour () {
		this.updateHour(this.hours + 1);
	};

	updateDay (value: number) {
		this.days = value;
		events.emit(['clock', 'day'], this.days);
		store.dispatch(updateClockTime(this.hours, this.days));
	};

	/**
	 * Increments the days by one
	 */
	incrementDay () {
		this.updateDay(this.days + 1);
	};

	/**
	 * Get a timestamp object for the current time
	 *
	 * @return {Object} Timestamp object with [day, hour, string] props
	 */
	getTimestamp (): { day: number, hour: number, string: string } {
		return {
			day: this.days,
			hour: this.hours,
			string: 'Day: ' + this.days + ' Time: ' + this.hours + ':00'
		};
	};

	/**
	 * Set a timer for a set number of hours and call a callback after
	 * that time passes
	 *
	 * @param {Number} hours The hours to set the timer for
	 * @param {Function} callback The callback to call after the time has passed
	 */
	timer (hours: number, callback: () => void) {
		var start = this.ticks,
			end = start + hoursToTicks(hours);

		return this.addTimerCallback(end, callback);
	};
};

export const gameClock = new GameClock();