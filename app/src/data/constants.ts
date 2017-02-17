import {config} from './config';

interface IConstants {
	colors: {
		BLUE_GREEN: number,
		WHITE: number,
		RED: number,
		DARK_RED: number,
		HARVEST_GREEN: number,
		GRAY: number,
		LIGHT_GRAY: number,
		DARK_GRAY: number
	};
	SCALE_UP: boolean;
	TILE_HEIGHT: number;
	TICKS_PER_SECOND: number;
	TICKS_PER_HOUR: number;
	MOCK_TICKS_PER_HOUR: number;
	SLEEP: {
		PER_DAY: number;
		MAX: number;
		RECOVER_TICK: number;
	};
	HUNGER: {
		MAX: number;
	};
	foodValue: number;
	SCALE_FACTOR: number;
	SCALED_TILE_HEIGHT: number;
	ACCESSIBLE: number;
	INACCESSIBLE: number;
	LAST_LOADED_LEVEL: string;
	SPRITE_PATH: string;
	TOWN_ID: number;
	PROTECTED_IDS: number[];
}

export const constants = {
	ACCESSIBLE: 0,
	INACCESSIBLE: 1,
	colors: {
		BLUE_GREEN: 0x218C8D,
		WHITE: 0xFFFFFF,
		RED: 0xF70B06,
		DARK_RED: 0xBF3A38,
		HARVEST_GREEN: 0x0077B2,
		LIGHT_GRAY: 0xAAAAAA,
		GRAY: 0x999999,
		DARK_GRAY: 0x666666
	},
	// Scale up the game for big screens
	SCALE_UP: false,
	// This is the actual tile height
	TILE_HEIGHT: 24,
	// Normal speed is 20 ticks per second
	TICKS_PER_SECOND: 20,
	SLEEP: {
		// Sleep 6 hours per day
		PER_DAY: 6
	},
	LAST_LOADED_LEVEL: 'lastLoadedLevel',
	SPRITE_PATH: '/sprites/',
	TOWN_ID: 0
} as IConstants;

constants.PROTECTED_IDS = [constants.TOWN_ID];

// An in game hour should be 10 second on normal speed
constants.MOCK_TICKS_PER_HOUR = constants.TICKS_PER_SECOND * 10;
// TICKS_PER_HOUR: 1200,
constants.TICKS_PER_HOUR = constants.MOCK_TICKS_PER_HOUR;//constants.TICKS_PER_SECOND * 30;
// We're scaling the screen up by 2
constants.SCALE_FACTOR = constants.SCALE_UP ? 2 : 1;
// When we're dealing outside of game code (i.e. figuring out where a user clicked using windoe relative coords) we need to use the scaled tile height
constants.SCALED_TILE_HEIGHT = constants.TILE_HEIGHT * constants.SCALE_FACTOR;

// The max amount for the sleep status
// This value is calculated to make a citizen pass out after 30 minutes of not sleeping
// Right now we'll just set it to like 5 minutes for testing
constants.SLEEP.MAX = constants.TICKS_PER_HOUR * (24 - constants.SLEEP.PER_DAY);
// The amount of sleep recovered while sleeping per tick
// Derived from 6 hours of sleep per day plus 1 to counteract the sleep per turn (1 tick)
// this.SLEEP.RECOVER_TICK = ((24 - this.SLEEP.PER_DAY) / this.SLEEP.PER_DAY) + 1;
constants.SLEEP.RECOVER_TICK = constants.SLEEP.MAX / (constants.SLEEP.PER_DAY * constants.TICKS_PER_HOUR) + 1;
constants.HUNGER = {
	// The max amount for the hunger status
	// This value is calculated to make a citizen die(?) of hunger after 30 minutes of not eating
	// Right now we'll just set it to like 30 seconds for testing
	MAX: constants.TICKS_PER_HOUR * 24 * config.daysToStarve
};
constants.foodValue = constants.HUNGER.MAX / 3;

console.log(constants);