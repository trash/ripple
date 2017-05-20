import {Util} from '../util';
import {humanNames} from './human';
import {Gender} from '../interfaces';
// import {wolfNames} from './wolf-names';
// import {deerNames} from './deer-names';
// import {tavernNames} from './tavern-names';
// import {herbalistNames} from './herbalist-names';
// import {itemShopNames} from './item-shop-names';
// import {goblinNames} from './goblin-names';
import {zombieNames} from './zombie';
// import {rabbitNames} from './rabbit-names';

export class Names {
	static raceMap = {
		human: humanNames,
		// wolf: wolfNames,
		// deer: deerNames,
		// goblin: goblinNames,
		zombie: zombieNames,
		// rabbit: rabbitNames
	};
	// static buildingMap = {
	// 	tavern: tavernNames,
	// 	'herbalist-hut': herbalistNames,
	// 	'item-shop': itemShopNames
	// };

	/**
	 * Returns a first name matching the given gender
	 *
	 * @param {String} race The race the name should come from
	 * @param {String} [gender] Optional gender'male' or 'female'
	 * @return {String} A first name
	 */
	firstName (race: string, gender: Gender) {
		var firstNameList = Names.raceMap[race].firstName;
		if (gender) {
			firstNameList = firstNameList[gender];
		}

		return Util.capitalize(Util.randomFromList<string>(firstNameList));
	}

	/**
	 * Gets a first and last name based on gender
	 *
	 * @param {String} gender 'male' or 'female'
	 * @return {Object} Object with first, last as keys with first and last names attached
	 */
	getName (race: string, gender: Gender): {first: string, last: string} {
		return {
			first: this.firstName(race, gender),
			last: this.lastName(race)
		};
	}

	// getBuildingName (type: string) {
	// 	// TODO make lists for all buildings
	// 	var buildingEntry = Names.buildingMap[type] || Names.buildingMap.tavern;

	// 	return 'the ' + this.randomFromList(buildingEntry.adjectives) + ' ' +
	// 		this.randomFromList(buildingEntry.nouns);
	// };

	/**
	 * Returns a random last name
	 *
	 * @return {String} The last name
	 */
	lastName (race: string) {
		var surnamePrefixList = Names.raceMap[race].surnamePrefix,
			surnameSuffixList = Names.raceMap[race].surnameSuffix;

		return Util.capitalize(Util.randomFromList<string>(surnamePrefixList)) +
			Util.randomFromList<string>(surnameSuffixList);
	}
}

export let names = new Names();