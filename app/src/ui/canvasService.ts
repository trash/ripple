import {XYCoordinates} from '../interfaces';
import {EventEmitter2} from 'eventemitter2';

export class CanvasService extends EventEmitter2 {
    canvas: HTMLCanvasElement;

    instantiateCanvas (canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.style['float'] = 'left';
        document.body.appendChild(this.canvas);
		this.emit('canvas-set');
    }

    /**
	 * Returns the offest of the canvas, useful for dom calculations outside of phaser code
	 */
	getCanvasOffset (): XYCoordinates {
		if (!this.canvas) {
			return null;
		}
		return {
			x: this.canvas.offsetLeft,
			y: this.canvas.offsetTop
		};
	}
}

export const canvasService = new CanvasService();