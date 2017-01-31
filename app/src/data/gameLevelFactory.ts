import * as _ from 'lodash';;
import {VillagerJob} from './villagerJob';
import {ITestLevel} from './testLevel';

const regularLevel: ITestLevel = {
	name: 'Regular Level',
	agents: [{
			name: 'human',
			villager: {
				job: VillagerJob.Laborer
			}
		}, {
			name: 'human',
			villager: {
				job: VillagerJob.Builder
			},
			// inventory: ['sword-wood', 'armor-wood']
		}, {
			name: 'human',
			villager: {
				job: VillagerJob.Builder
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
		allLand: true,
		noResources: true
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