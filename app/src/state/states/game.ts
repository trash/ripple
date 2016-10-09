import {events} from '../../events';
import {IState} from './state';
import {StateManager} from '../state-manager';

export class GameState implements IState {
	manager: StateManager;

	create () {
		events.emit('game-start');
	};

	shutdown () {
		events.emit('game-destroy');
	};
};