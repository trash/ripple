import {constants} from '../data/constants';
import {keybindings} from '../services/keybindings';
import {events} from '../events';
import {EventEmitter2} from 'eventemitter2';

/**
* Creates a new GameLoop object.
*
* @classdesc The GameLoop is is an interval that calls update on the GameManager every tick.
*
* @constructor
*/
export class GameLoop extends EventEmitter2 {
	step: number;
	stopped: boolean;
	last: number;
	now: number;
	delta: number;
	turn: number;

	constructor () {
		super();

		this.reset();

		// Default to 1/20 of a second
		this.step = 1 / constants.TICKS_PER_SECOND;

		keybindings.addKeyListener('space', (e: KeyboardEvent) => this.pause(e));
	}

	/**
	* Start the game loop
	*/
	start () {
		this.last = performance.now();
		this.stopped = false;
		this.loop();
	};

	isStopped (): boolean {
		return this.stopped;
	}

	loop () {
		this.now = performance.now();
		this.delta += Math.min(1, (this.now - this.last) / 1000);
		while (this.delta > this.step) {
			this.delta -= this.step;
			this.turn++;

			this.emit('update', this.turn, this.stopped);
		}

		this.last = this.now;
		requestAnimationFrame(() => this.loop());
	};

	/**
	* Stop the game loop
	*/
	stop () {
		this.stopped = true;
	};

	reset () {
		this.stopped = true;
		this.delta = 0;
		this.last = performance.now();
		this.turn = 0;
	};

	/**
	 * Toggles stop/start state
	 */
	pause (event?: KeyboardEvent) {
		if (event) {
			event.preventDefault();
		}
		if (!this.stopped) {
			this.stop();
		}
		else {
			this.start();
		}
		this.emit('pause', this.stopped);
	};

	/**
	 * Sets a new loop speed for the game.
	 *
	 * @param {Number} step The new step in seconds
	 */
	changeGameSpeed (step: number) {
		this.pause();
		this.step = step;
		this.pause();
	};
}