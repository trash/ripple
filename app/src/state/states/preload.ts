import React = require('react');
import ReactDOM = require('react-dom');
import {MusicPlayer} from '../../game/music-player';
const spritesDirectories = require('../../../sprites/directory.json');
import {LoadScreen as LoadScreenComponent} from '../../views/load-screen';
let LoadScreen = React.createFactory(LoadScreenComponent);
import {State} from './state';
import {StateManager} from '../state-manager';
import PIXI = require('pixi.js');

// Handle loading sprites in test environment
var baseDirectory = window['TEST'] ? '/base/app/' : '';

export class PreloaderState implements State {
	manager: StateManager;
	component: any;

	preload () {
		this.renderComponent(0);
		this.component.show();
	};
	renderComponent (percent) {
		this.component = ReactDOM.render(LoadScreen({
			percent: percent
		}), this.manager.element);
	};
	create () {
		spritesDirectories.list.forEach(folderName => {
			PIXI.loader
				.add(folderName, baseDirectory + 'sprites/' + folderName + '.png')
				.add(folderName + '-json', baseDirectory + 'sprites/' + folderName + '.json');
		});


		new MusicPlayer([
			// 'audio/music/truncate.mp3',
			// 'audio/music/df.mp3',
			'audio/music/ragnarok-ethical-aspiration.mp3',
			'audio/music/df.mp3',
		]);

		PIXI.loader
			.on('progress', loader => {
				this.renderComponent(Math.floor(loader.progress));
			});
		PIXI.loader
			.load((loader, resources) => {
				console.log('All resources completed loading:', resources);

				// Jump straight to game in test environment
				if (window['TEST']) {
					return this.manager.start('Game');
				}
				this.manager.start('MainMenu');
			});
	};

	shutdown () {
		this.component.hide();
	};
}