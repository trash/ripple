import _ = require('lodash');
import {villagerJobs} from './villager-jobs';
import {ITestLevel} from './test-level';

const regularLevel: ITestLevel = {
	name: 'Regular Level',
	agents: [{
			name: 'human',
			villager: {
				job: villagerJobs.laborer
			}
		}, {
			name: 'human',
			villager: {
				job: villagerJobs.builder
			},
			// inventory: ['sword-wood', 'armor-wood']
		}, {
			name: 'human',
			villager: {
				job: villagerJobs.builder
			}
		},
	],
	gameMap: {
		dimension: 200,
		seed: 0.8908902304
	}
};

const testLevel: ITestLevel = {
	name: 'Test Level',
	gameMap: {
		dimension: 20,
		seed: 666,
		allLand: true
	},
};

export class GameLevelFactory {
	getDefaultTestLevel (): ITestLevel {
		return testLevel;
	}
	getLevel (level: ITestLevel): ITestLevel {
		return this._process(regularLevel, level);
	}
	getTestLevel (level: ITestLevel): ITestLevel {
		return this._process(testLevel, level);
	}
	_process (baseLevel, level: ITestLevel): ITestLevel {
		return _.extend({}, baseLevel, level);
	}
};

export let gameLevelFactory = new GameLevelFactory();