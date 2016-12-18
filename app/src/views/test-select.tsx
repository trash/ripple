import React = require('react');
import {events} from '../events';
import {testLevels, ITestLevelGroup, lastLoadedLevelGroup} from '../data/test-levels';
import {TestLevel} from './test-level';
import {ShowHideComponent, ShowHideComponentState} from './higher-order/show-hide-component';

interface TestSelectProps {
	mainMenu: Function;
	startTest: Function;
}
interface TestSelectState extends ShowHideComponentState {
	expandedGroup: string;
}

export class TestSelect extends ShowHideComponent<TestSelectState> {
	constructor (props, context) {
		super(props, context);
		this.state.expandedGroup = lastLoadedLevelGroup.name;
	}

	groupClick (group) {
		events.emit(['trigger-sound', 'uiClick']);
		return () => {
			this.setState({
				expandedGroup: group.name
			} as TestSelectState);
		};
	}

	renderMenuBlock (group: ITestLevelGroup) {
		const isExpanded = this.state.expandedGroup === group.name;
		return (
			<div className={`menu-block ${ isExpanded ? 'expanded' : '' }`}
				key={ group.name }
				onClick={ this.groupClick(group) }>
				<h4>{ group.name }</h4>
				{ group.list.map(tutorialLevel => {
					return <TestLevel
						key={ tutorialLevel.name }
						startTest={ this.props.startTest }
						level={ tutorialLevel }/>;
				}) }
			</div>
		);
	}

	render () {
		return (
			<div className={ 'menu main-menu ' + (this.state.hidden ? 'hide' : '') }>
				<h1 className="game-header">Ripple</h1>
				<div className="menu-body">
					<h4 className="menu-header">Tutorials</h4>
					<button onClick={ this.props.mainMenu }>Main Menu</button>
					{ this.renderMenuBlock(lastLoadedLevelGroup) }
					{testLevels.map(group => this.renderMenuBlock(group))}
				</div>
			</div>
		);
	}
};