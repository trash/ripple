import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {MusicPlayer} from '../../game/music-player';
const spritesDirectories = require('../../../sprites/directory.json');
import {LoadScreen as LoadScreenComponent} from '../../views/loadScreen';
let LoadScreen = React.createFactory(LoadScreenComponent);
import {IState} from './state';
import {StateManager} from '../state-manager';
import * as PIXI from 'pixi.js';

// Handle loading sprites in test environment
var baseDirectory = window['TEST'] ? '/base/app/' : '';

export class PreloaderState implements IState {
	manager: StateManager;
	component: any;

	preload () {
		this.renderComponent(0);
		this.component.show();
	}
	renderComponent (percent: number) {
		this.component = ReactDOM.render(LoadScreen({
			percent: percent
		}), this.manager.element);
	}
	create (done: Function) {
		spritesDirectories.list.forEach((folderName: string) => {
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
				done();
			});
	}

	shutdown () {
		this.component.hide();
	}
}