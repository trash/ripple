import {IState} from './states/state';

interface IStateMap {
	[index: string]: IState;
}

export class StateManager {
	current: IState;
	states: IStateMap;
	element: Element;

	constructor (rootElement: Element) {
		this.current = null;
		this.states = {};
		this.element = rootElement;
	}

	add (key: string, State: new () => IState) {
		var state = new State();
		state.manager = this;
		this.states[key] = state;
	}

	start (key: string, nextStateKey?: string) {
		if (this.current && this.current.shutdown) {
			this.current.shutdown();
		}

		var state = this.states[key];
		this.current = state;

		if (state.preload) {
			state.preload();
		}
		state.create(() => {
			this.start(nextStateKey);
		});
	}
};