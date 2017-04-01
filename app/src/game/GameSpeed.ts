import {events} from '../events';
import {EventEmitter2} from 'eventemitter2';
import {keybindings} from '../services/keybindings';
import {constants} from '../data/constants';
import {GameLoop} from './GameLoop';
import {store} from '../redux/store';
import {updateGameSpeed} from '../redux/actions';

// Speed values/buttons to press
const values = [0, 1, 2, 3, 4];

export type SpeedUpEvent = 'gamespeed:speed-up';
export const SpeedUpEvent: SpeedUpEvent = 'gamespeed:speed-up';
export type SlowDownEvent = 'gamespeed:slow-down';
export const SlowDownEvent: SlowDownEvent = 'gamespeed:slow-down';

export class GameSpeed extends EventEmitter2 {
	value: number;
	loop: GameLoop;

	static speeds = [
		1 / (constants.TICKS_PER_SECOND),
		1 / (constants.TICKS_PER_SECOND*3),
		1 / (constants.TICKS_PER_SECOND*6),
		1 / (constants.TICKS_PER_SECOND*12),
		// hyper speed
		1 / (constants.TICKS_PER_SECOND*48)
	];

	constructor(loop: GameLoop) {
		super();
		this.loop = loop;
		this.value = 0;

		// Bind each number key in values to the speed update of that corresponding value
		values.forEach(value => {
			keybindings.addKeyListener(value + 1 + '', () =>
				this.updateGameSpeed(value));
		});

		events.on(SpeedUpEvent, () => this.speedUp());
		events.on(SlowDownEvent, () => this.slowDown());
	}

	private boundSpeedValue(value: number): number {
		if (value < 0) {
			return 0;
		} else if (value > GameSpeed.speeds.length - 1) {
			return GameSpeed.speeds.length - 1;
		}
		return value;
	}

	private speedUp() {
		this.updateGameSpeed(this.boundSpeedValue(this.value + 1));
	}
	private slowDown() {
		this.updateGameSpeed(this.boundSpeedValue(this.value - 1));
	}

	updateGameSpeed(value: number) {
		this.triggerSound(value);

		this.value = value;

		this.loop.changeGameSpeed(GameSpeed.speeds[value]);

		this.emit('update', value);
		store.dispatch(updateGameSpeed(value));
	}

	private triggerSound(value: number) {
		const sound = `clock${(value + 1)}`;
		events.emit(['trigger-sound', sound], {
			volume: 0.25
		});
	}
}