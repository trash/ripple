import * as React from 'react'
import {ITestLevel} from '../data/TestLevel';

interface TestLevelProps {
	startTest: Function;
	level: ITestLevel;
}

export class TestLevel extends React.Component<TestLevelProps, void> {
	render () {
		let level = this.props.level;
		return (
			<div key={ level.name } className="menu-block-inner">
				<h5>{ level.name }</h5>
				<p>{ level.description }</p>
				<button onClick={ () => this.props.startTest(level) }>Start Test</button>
			</div>
		);
	}
};