import {constants} from './data/constants';
const localStorageKey = 'ripple-unique-id';

/**
 * Service that generates unique ids
 */
export class UniqueId {
	currentId: number;

	constructor () {
		const startId = Math.max(...constants.PROTECTED_IDS);
		this.currentId = parseInt(localStorage.getItem(localStorageKey))
			|| startId;
	}

	/**
	 * Gets a new unique id.
	 * Will never return 0. Thus unique ids are always truthy
	 *
	 * @return {String} unique id
	 */
	get (): string {
		const id = this.currentId;
		this.currentId++;
		localStorage.setItem(localStorageKey, this.currentId + '');
		// Return it as a string so it's always truthy (even when 0)
		return id + '';
	};
};

export let uniqueId = new UniqueId();