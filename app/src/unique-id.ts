const localStorageKey = 'ripple-unique-id';

/**
 * Service that generates unique ids
 */
export class UniqueId {
	currentId: number;

	constructor () {
		this.currentId = parseInt(localStorage.getItem(localStorageKey)) || 0;
	}

	/**
	 * Gets a new unique id
	 *
	 * @return {String} unique id
	 */
	get (): string {
		var id = this.currentId;
		this.currentId++;
		localStorage.setItem(localStorageKey, this.currentId + '');
		// Return it as a string so it's always truthy (even when 0)
		return id + '';
	};
};

export let uniqueId = new UniqueId();