// Ordered list of professions
// Ordered by priority. Thus a citizen with both the 'woodcutter' and 'citizen'
// professions would choose to complete a woodcutter job before a citizen job
export enum Profession {
	Guard = 1,
	Gatherer,
	// Farmer,
	// Herbalist,
	Builder,
	Blacksmith,
	Woodcutter,
	Miner,
	// Hunter,
	Baker,
	// Brewer,
	Carpenter,
	Hauler,
	// Fisherman,
	Shopkeeper
}

const professionsKeys = Object.keys(Profession);

// Make sure we don't get the first half of the keys which will be their
// enum values (0, 1, 2, etc)
export let professionsList = professionsKeys.slice(0, professionsKeys.length / 2)
	.map(profession => parseInt(profession));