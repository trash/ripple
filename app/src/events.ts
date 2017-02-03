import {EventEmitter2} from 'eventemitter2';

// Create the events object for the game
export const events = new EventEmitter2({
	wildcard: true
});

events.setMaxListeners(100);