import {b3} from '../index';
import {Decorator, IDecoratorOptions} from './decorator';
import {Inverter} from './inverter';
import {Tick} from './tick';
import {gameManager} from '../../core/game/game-manager';
import {util} from '../../core/util';

var timerKey = 'timer:hours-passed';

interface ITimerOptions extends IDecoratorOptions {
	hours: number;
}

/**
 * The Inverter decorator inverts the result of the child, returning `SUCCESS`
 * for `FAILURE` and `FAILURE` for `SUCCESS`.
 *
 * @module b3
 * @class Inverter
 * @extends Decorator
**/
export class Timer extends Decorator {
	hours: number;

	constructor (options: ITimerOptions) {
		super(options);
	}

	initialize (options: ITimerOptions) {
		super.initialize(options as IDecoratorOptions);

		this.hours = options.hours || null;
	}
	open (tick: Tick) {
		util.blackboardSet(tick, timerKey, false);
		gameManager.clock.timer(this.hours, () => {
			util.blackboardSet(tick, timerKey, true);
		});
	}
	/**
	 * Tick method.
	 * @method tick
	 * @param {Tick} tick A tick instance.
	 * @return {Constant} A state constant.
	**/
	tick (tick: Tick) {
		if (!this.child || !this.hours) {
			debugger;
			return b3.ERROR;
		}
		let timerDone = util.blackboardGet(tick, timerKey);

		if (!timerDone) {
			return b3.RUNNING;
		}

		// Run the child after the timer is done and return its status
		return this.child._execute(tick);
	}
}