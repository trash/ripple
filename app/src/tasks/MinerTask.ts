import {HarvesterTask} from './HarvesterTask';
import {Professions} from '../data/professions';
import {StatusBubble} from '../data/status-bubble';

/**
* Creates a new MinerTask object.
*
* @classdesc A task associated with a rock to be mined.
*
* @extends {HarvesterTask}
*
* @constructor
* @param {Rock} rock The rock to be mined by the citizen.
*/
export class MinerTask extends HarvesterTask {
	constructor (rock: number) {
		// Call our parent constructor
		super({
			name: 'miner-task',
			taskType: Professions.Miner,
			bubble: StatusBubble.Mine
		}, rock);

		// Description of the woodcutting task
		this.description = `Mining a rock at ${this.destinationTile.column},
			${this.destinationTile.row}.`;
	}
};