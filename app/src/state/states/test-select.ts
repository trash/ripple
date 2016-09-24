import React = require('react');
import ReactDOM = require('react-dom');
import {events} from '../../events';
import {State} from './state';
import {StateManager} from '../state-manager';
import {TestSelect as TestSelectComponent} from '../../views/test-select';

export class TestSelectState implements State {
	manager: StateManager;
	component: any;

	create () {
		var TestSelect = React.createFactory(TestSelectComponent);

		this.component = ReactDOM.render(TestSelect({
			mainMenu: this.mainMenu.bind(this),
			startTest: this.startTest.bind(this)
		}), this.manager.element);

		this.component.show();
	}

	startTest (level) {
		return () => {
			events.emit(['trigger-sound', 'uiClick']);
			events.emit('start-game', level);
		};
	}

	mainMenu () {
		this.manager.start('MainMenu');
	}

	shutdown () {
		this.component.hide();
	}
}