import {HarvesterTask} from './harvester-task';
import {professions} from '../data/professions';

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
			taskType: professions.miner,
			bubble: 'mine'
		}, rock);

		// Description of the woodcutting task
		this.description = 'Mining a rock at ' + this.destinationTile.column + ',' +
			this.destinationTile.row + '.';
	}
};