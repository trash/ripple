import {State} from './states/state';

interface IStateMap {
	[index: string]: State;
}

export class StateManager {
	current: State;
	states: IStateMap;
	element: Element;

	constructor (rootElement: Element) {
		this.current = null;
		this.states = {};
		this.element = rootElement;
	}

	add (key: string, State: new () => State) {
		var state = new State();
		state.manager = this;
		this.states[key] = state;
	};

	start (key: string) {
		if (this.current && this.current.shutdown) {
			this.current.shutdown();
		}

		var state = this.states[key];
		this.current = state;

		if (state.preload) {
			state.preload();
		}
		state.create();
	};
};