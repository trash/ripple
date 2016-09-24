import React = require('react');
import ReactDOM = require('react-dom');
import {MainMenu as MainMenuComponent} from '../../views/main-menu';
let MainMenuComponentFactory = React.createFactory(MainMenuComponent);
import {State} from './state';
import {StateManager} from '../state-manager';

export class MainMenuState implements State {
	component: any;
	manager: StateManager;

	create () {
		this.component = ReactDOM.render(MainMenuComponentFactory({
			startGame: this.startGame.bind(this),
			loadGame: this.loadGame.bind(this),
			generateMap: this.generateMap.bind(this),
			tutorialSelect: this.tutorialSelect.bind(this),
			testSelect: this.testSelect.bind(this),
		}), this.manager.element);

		this.component.show();
	};

	startGame () {
		this.manager.start('StartingSupplies');
	};

	loadGame () {
		this.manager.start('LoadGame');
	};

	tutorialSelect () {
		this.manager.start('TutorialSelect');
	};

	testSelect () {
		this.manager.start('TestSelect');
	};

	generateMap () {
		this.manager.start('MapGeneration');
	};

	shutdown () {
		this.component.hide();
	};
}