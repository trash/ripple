import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {events} from '../../events';
import {IState} from './state';
import {State} from '../StateEnum';
import {StateManager} from '../state-manager';
import {TestSelect as TestSelectComponent} from '../../views/testSelect';
import {ITestLevel} from '../../data/testLevel';

export class TestSelectState implements IState {
	manager: StateManager;
	component: TestSelectComponent;

	create () {
		var TestSelect = React.createFactory(TestSelectComponent);

		this.component = ReactDOM.render(TestSelect({
			mainMenu: () => this.mainMenu(),
			startTest: (level: ITestLevel) => this.startTest(level),
		}), this.manager.element) as TestSelectComponent;

		this.component.show();
	}

	startTest (level: ITestLevel) {
		events.emit(['trigger-sound', 'uiClick']);
		events.emit('level-selected', level);
	}

	mainMenu () {
		this.manager.start(State.MainMenu);
	}

	shutdown () {
		this.component.hide();
	}
}