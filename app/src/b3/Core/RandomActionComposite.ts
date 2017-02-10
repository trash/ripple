import * as _ from 'lodash';
import {b3} from '../index';
import * as Core from './index';

export class RandomActionComposite extends Core.Composite {
	tick (tick: Core.Tick) {
		let choices = [],
			i;
		for (i = 0; i < this.children.length; i++) {
			choices.push(i);
		}
		choices = _.shuffle(choices);

		// Iterates over the children randomly
		for (i = 0; i < this.children.length; i++) {
			const index = choices.pop();
			// Propagate the tick
			const status = this.children[index]._execute(tick);

			if (status !== b3.SUCCESS) {
				return status;
			}
		}

		return b3.SUCCESS;
	}
}