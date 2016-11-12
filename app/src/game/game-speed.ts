import {events} from '../events';
import {EventEmitter2} from 'eventemitter2';
import {keybindings} from '../services/keybindings';
import {constants} from '../data/constants';
import {GameLoop} from './game-loop';

// Speed values/buttons to press
const values = [0, 1, 2, 3, 4];

export class GameSpeed extends EventEmitter2 {
	value: number;
	speeds: number[];
	loop: GameLoop;

	constructor (loop: GameLoop) {
		super();
		this.loop = loop;
		this.value = 0;
		this.speeds = [
			1 / (constants.TICKS_PER_SECOND),
			1 / (constants.TICKS_PER_SECOND*3),
			1 / (constants.TICKS_PER_SECOND*6),
			1 / (constants.TICKS_PER_SECOND*12),
			// hyper speed
			1 / (constants.TICKS_PER_SECOND*48)
		];

		// Bind each number key in values to the speed update of that corresponding value
		values.forEach(value => {
			keybindings.addKeyListener(value + 1 + '', () => {
				this.triggerSound(value);
				this.updateGameSpeed(value);
			});
		});
	}
	updateGameSpeed (value: number) {
		this.value = value;

		this.loop.changeGameSpeed(this.speeds[value]);

		this.emit('update', value);
	};

	triggerSound (value: number) {
		const sound = 'clock' + (value + 1);
		events.emit(['trigger-sound', sound], {
			volume: 0.25
		});
	};
};