import * as React from 'react'
import {ShowHideComponent, ShowHideComponentState} from './higherOrder/showHideComponent';

interface MainMenuProps {
	startGame: () => void;
	loadGame: () => void;
	generateMap: () => void;
	tutorialSelect: () => void;
	testSelect: () => void;
}

export class MainMenu extends ShowHideComponent<ShowHideComponentState> {
	render () {
		return (
			<div className={`menu main-menu ${(this.state.hidden && 'hide')}` }>
				<h1 className="game-header">Ripple</h1>
				<div className="menu-body">
					<h4 className="menu-header">Main Menu</h4>
					<button onClick={ () => this.props.startGame() }>New game</button>
					<button onClick={ () => this.props.loadGame() }>Load game</button>
					<button style={{display: 'none'}}
						onClick={ () => this.props.generateMap() }>Generate Map</button>
					<button onClick={ () => this.props.testSelect() }>Tests</button>
				</div>
			</div>
		);
	}
};