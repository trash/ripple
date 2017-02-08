import {IState} from './states/state';
import {State} from './StateEnum';

interface IStateMap {
	[index: number]: IState;
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

	add (stateEnum: State, State: new () => IState) {
		const state = new State();
		state.manager = this;
		this.states[stateEnum] = state;
	}

	start (stateEnum: State, nextStateKey?: State) {
		if (this.current && this.current.shutdown) {
			this.current.shutdown();
		}

		const state = this.states[stateEnum];
		this.current = state;

		if (state.preload) {
			state.preload();
		}
		state.create(() => {
			this.start(nextStateKey);
		});
	}
};