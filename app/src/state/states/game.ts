import {events} from '../../events';
import {State} from './state';
import {StateManager} from '../state-manager';

export class GameState implements State {
	manager: StateManager;

	create () {
		events.emit('game-start');
	};

	shutdown () {
		events.emit('game-destroy');
	};
};