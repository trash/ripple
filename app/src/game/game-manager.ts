import {StateManager} from '../state/state-manager';
import {PreloaderState} from '../state/states/preload';
import {MainMenuState} from '../state/states/main-menu';
import {TestSelectState} from '../state/states/test-select';

export class GameManager {
    state: StateManager;

    constructor (rootElement: Element) {
        console.info('GameManager initialized.');
        this.state = new StateManager(rootElement);
        this.bootstrapGameStates();
    }

    bootstrapGameStates () {
		this.state.add('Preload', PreloaderState);
		this.state.add('MainMenu', MainMenuState);
		// this.state.add('Game', GameState);
		this.state.add('TestSelect', TestSelectState);

		this.state.start('Preload');
	};
}