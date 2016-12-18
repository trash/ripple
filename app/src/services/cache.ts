export class CacheService {
	cache: any;
	clearTimeouts: any;

	constructor () {
		this.cache = {};
		this.clearTimeouts = {};
	}

	normalizeArgs (
		args: any
	): string {
		return JSON.stringify(args);
	}

	getValue (
		name: string,
		args: any
	): any {
		args = this.normalizeArgs(args);

		if (!this.cache[name]) {
			this.cache[name] = {};
		}

		return this.cache[name][args];
	}

	clearTimeout (
		name: string,
		args: any
	) {
		if (!this.clearTimeouts[name]) {
			this.clearTimeouts[name] = {};
		}

		clearTimeout(this.clearTimeouts[name][args]);
	}

	startTimeout (
		name: string,
		args: any,
		expire: number
	) {
		// clear existing setTimeout if there is one
		this.clearTimeout(name, args);

		if (!this.clearTimeouts[name]) {
			this.clearTimeouts[name] = {};
		}
		this.clearTimeouts[name][args] = setTimeout(() => {
			this.delete(name, args);
		}, expire);
	}

	delete (name: string, args: any) {
		delete this.cache[name][args];
	}

	store (
		name: string,
		args: any,
		value: any,
		expire: number
	) {
		args = this.normalizeArgs(args);

		if (!this.cache[name]) {
			this.cache[name] = {};
		}

		// If it's already stored, let it expire on it's own
		if (this.cache[name][args]) {
			return;
		}

		this.cache[name][args] = value;
		if (expire) {
			// start a settimeout to delete
			this.startTimeout(name, args, expire);
		}
	}
}

export let cacheService = new CacheService();

window['gameCache'] = cacheService;