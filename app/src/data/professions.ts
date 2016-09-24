// Ordered list of professions
// Ordered by priority. Thus a citizen with both the 'woodcutter' and 'citizen'
// professions would choose to complete a woodcutter job before a citizen job
export enum professions {
	guard,
	gatherer,
	farmer,
	herbalist,
	builder,
	blacksmith,
	woodcutter,
	miner,
	hunter,
	baker,
	brewer,
	carpenter,
	citizen,
	fisherman,
	shopkeeper
}

const professionsKeys = Object.keys(professions);

// Make sure we don't get the first half of the keys which will be their
// enum values (0, 1, 2, etc)
export let professionsList = professionsKeys.slice(0, professionsKeys.length / 2)
	.map(profession => parseInt(profession));