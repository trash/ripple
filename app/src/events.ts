import {EventEmitter2} from 'eventemitter2';

export class Events extends EventEmitter2 {
	EventEmitter2: any;

	static EventEmitter2 = EventEmitter2;

	constructor (options) {
		super(options);
		this.EventEmitter2 = Events.EventEmitter2;
	}
}

// Create the events object for the game
export let events = new Events({
	wildcard: true
});

events.setMaxListeners(100);