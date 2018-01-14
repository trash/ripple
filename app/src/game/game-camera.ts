import * as TWEEN from 'tween.js';

import {events} from '../events';
import {keybindings} from '../services/keybindings';
import {IRowColumnCoordinates} from '../interfaces';
import {IPositionState} from '../entity/components';

const minSpeed = 10;

let keysPressed = {},
	keymap = {
		up: keybindings.keyMap['w'],
		left: keybindings.keyMap['a'],
		down: keybindings.keyMap['s'],
		right: keybindings.keyMap['d']
	};

// Give room for trees to show
const buffer = {
	vertical: document.body.clientHeight -24,
	horizontal: document.body.clientWidth -24
};

export class GameCamera {
	tilemap: any;
	speed: number;
	scale: number;
	view: {
		x: number,
		y: number,
		width: number,
		height: number
	};

	constructor () {
		this.tilemap = null;

		this.speed = minSpeed;

		this.scale = 1;

		window.addEventListener('keydown', event => {
			keysPressed[event.keyCode] = true;
		});
		window.addEventListener('keyup', function (event) {
			delete keysPressed[event.keyCode];
		});

		events.on('minimap-mount', () => this.emitUpdate());
		events.on('focusPosition', (position: IPositionState) => this.setToTile(position.tile));
	}

	get x () {
		return this.tilemap.x;
	}
	get y () {
		return this.tilemap.y;
	}

	/**
	 * Method to call on the camera every tick of the game loop.
	 * This handles calling the proper move command based on the keys pressed down.
	 */
	update () {
		// Check for different direction keys and pass them to the camera when they're held down
		Object.keys(keymap).forEach(key => {
			if (keymap[key] in keysPressed &&
				document.activeElement.nodeName !== 'INPUT'
			) {
				this[key]();
			}
		});
	}

	setTilemap (tilemap) {
		this.tilemap = tilemap;

		this.speed = Math.max(tilemap.dimension * 20 / 120, minSpeed);

		this.emitUpdate();
	}

	focusOn (sprite) {
		this.setTo(
			sprite.parent.parent.position.x,
			sprite.parent.parent.position.y
		);
	}

	getTileSize (): number {
		return this.tilemap.getWidth() / this.tilemap.dimension;
	}

	/**
	 * Calculate the view and emit it when the camera is moved
	 */
	emitUpdate (userUpdate?) {
		const view = {
			x: -this.tilemap.position.x,
			y: -this.tilemap.position.y,
			width: document.body.clientWidth,
			height: document.body.clientHeight
		};

		events.emit('camera-update', view, userUpdate);

		this.tilemap.updateView(view);

		this.view = view;
	}

	setToTile (tile: IRowColumnCoordinates, animate: boolean = false) {
		this.setTo(
			tile.column * this.getTileSize(),
			tile.row * this.getTileSize(), animate
		);
	}

	setToFromMinimap (x: number, y: number) {
		this.setTo(
			x * this.tilemap.getWidth(),
			y * this.tilemap.getHeight()
		);
	}

	setTo (x: number, y: number, animate: boolean = false) {
		if (animate) {
			let animateTime = 250;
			var lastPosition = {
					x: this.tilemap.position.x,
					y: this.tilemap.position.y
				}, newPosition = {
					x: -x + (1/2 * document.body.clientWidth),
					y: -y + (1/2 * document.body.clientHeight)
				},
				camera = this;
			new TWEEN
				.Tween(lastPosition)
				.to(newPosition, animateTime)
				.easing(TWEEN.Easing.Cubic.In)
				.onUpdate(() => {
					camera.tilemap.position.x = this.x;
					camera.tilemap.position.y = this.y;
				}).start();
			setTimeout(() => this.emitUpdate(), animateTime);
			return;
		}
		this.tilemap.position.x = -x + (1/2 * document.body.clientWidth);
		this.tilemap.position.y = -y + (1/2 * document.body.clientHeight);
		this.emitUpdate();
	}

	left () {
		if (this.tilemap.position.x < 0 + buffer.horizontal) {
			this.tilemap.position.x += this.speed;
			this.emitUpdate(true);
		}
	}

	right () {
		if (this.tilemap.position.x > -this.tilemap.getWidth() + document.body.clientWidth  - buffer.horizontal) {
			this.tilemap.position.x -= this.speed;
			this.emitUpdate(true);
		}
	}

	up () {
		if (this.tilemap.position.y < 0 + buffer.vertical) {
			this.tilemap.position.y += this.speed;
			this.emitUpdate(true);
		}
	}

	down () {
		if (this.tilemap.position.y > -this.tilemap.getHeight() + document.body.clientHeight - buffer.vertical) {
			this.tilemap.position.y -= this.speed;
			this.emitUpdate(true);
		}
	}
}