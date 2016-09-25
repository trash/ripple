import {ICoordinates} from '../interfaces';

export class CanvasService {
    canvas: HTMLCanvasElement;

    instantiateCanvas (canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.style['float'] = 'left';
        document.body.appendChild(this.canvas);
    }

    /**
	 * Returns the offest of the canvas, useful for dom calculations outside of phaser code
	 */
	getCanvasOffset (): ICoordinates {
		if (!this.canvas) {
			return null;
		}
		return {
			x: this.canvas.offsetLeft,
			y: this.canvas.offsetTop
		};
	};
}

export const canvasService = new CanvasService();