import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {MainMenu as MainMenuComponent} from '../../views/mainMenu';
let MainMenuComponentFactory = React.createFactory(MainMenuComponent);
import {IState} from './state';
import {StateManager} from '../state-manager';
import {State} from '../StateEnum';

export class MainMenuState implements IState {
	component: any;
	manager: StateManager;

	create () {
		this.component = ReactDOM.render(MainMenuComponentFactory({
			startGame: () => this.startGame(),
			loadGame: () => this.loadGame(),
			generateMap: () => this.generateMap(),
			tutorialSelect: () => this.tutorialSelect(),
			testSelect: () => this.testSelect(),
		}), this.manager.element);

		this.component.show();
	}

	startGame () {
		// this.manager.start('StartingSupplies');
		this.manager.start(State.Game);
	}

	loadGame () {
		this.manager.start(State.LoadGame);
	}

	tutorialSelect () {
		this.manager.start(State.TutorialSelect);
	}

	testSelect () {
		this.manager.start(State.TestSelect);
	}

	generateMap () {
		this.manager.start(State.MapGeneration);
	}

	shutdown () {
		this.component.hide();
	}
}