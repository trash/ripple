import * as _ from 'lodash';;
import {VillagerJob} from './VillagerJob';
import {Agent} from './Agent';
import {ITestLevel} from './testLevel';

const regularLevel: ITestLevel = {
	name: 'Regular Level',
	agents: [{
			enum: Agent.Villager,
			data: {
				villager: {
					job: VillagerJob.Laborer
				}
			}
		}, {
			enum: Agent.Villager,
			data: {
				villager: {
					job: VillagerJob.Builder
				}
			},
			// inventory: ['sword-wood', 'armor-wood']
		}, {
			enum: Agent.Villager,
			data: {
				villager: {
					job: VillagerJob.Builder
				}
			}
		},
	],
	gameMap: {
		dimension: 100
	}
};

regularLevel.agents.forEach(agent => {
	agent.data = {
		position: {
			tile : {
				row: 10,
				column: 10
			}
		}
	};
});

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
	getDefaultRegularLevel(): ITestLevel {
		return regularLevel;
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