import {b3} from '../index';
import {Composite} from '../core/composite';
import {Tick} from '../core/tick';
import _ = require('lodash');

export class RandomActionComposite extends Composite {
	tick (tick: Tick) {
		var choices = [],
			i;
		for (i=0; i < this.children.length; i++) {
			choices.push(i);
		}
		choices = _.shuffle(choices);

		// Iterates over the children randomly
		for (i=0; i<this.children.length; i++) {
			var index = choices.pop();
			// Propagate the tick
			var status = this.children[index]._execute(tick);

			if (status !== b3.SUCCESS) {
				return status;
			}
		}

		return b3.SUCCESS;
	}
}