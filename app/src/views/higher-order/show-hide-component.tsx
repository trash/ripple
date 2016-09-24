import React = require('react');

export interface ShowHideComponentState {
	hidden: boolean;
}

let calledOnce = false;

export class ShowHideComponent<S extends ShowHideComponentState> extends React.Component<any, S> {
	constructor (props, context) {
		super(props, context);
		this.state = {
			hidden: true
		} as S;
	}

	show () {
		this.setState({
			hidden: false
		} as S);
	}
	hide () {
		this.setState({
			hidden: true
		} as S);
	}
	toggle () {
		if (this.state.hidden) {
			return this.show();
		}
		this.hide();
	}

	render () {
		return null;
	}
};