import * as React from 'react'
import {ShowHideComponent, ShowHideComponentState} from './higherOrder/showHideComponent';

interface LoadScreenProps {
	percent: number;
}

export class LoadScreen extends ShowHideComponent<ShowHideComponentState> {
	constructor(props, context) {
		super(props, context);
	}
	render () {
		return (
			<div className={ `menu  ${(this.state.hidden ? 'hide' : '')}` }>
				<div className="load-screen">
					<h1>Loading { this.props.percent }%</h1>
					<div className="progress">
						<div style={ { width: this.props.percent + '%' } }
							className="progress-bar"
							role="progressbar"/>
					</div>
				</div>
			</div>
		);
	}
}