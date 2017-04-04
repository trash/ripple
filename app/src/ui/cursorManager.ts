import {Cursor} from './Cursor';

const cursorMap = {
	[Cursor.Hand]: 'hand-cursor',
	[Cursor.Attack]: 'attack-cursor',
	[Cursor.Harvest]: 'harvest-cursor',
	[Cursor.CancelHarvest]: 'cancel-harvest-cursor'
};

export class CursorManager {
	cursorPosition: {
		x: number,
		y: number
	}
	currentCursor: string;

	constructor () {
		document.body.addEventListener('mousemove', event => {
			this.cursorPosition = {
				x: event.pageX,
				y: event.pageY
			};
		});
	}

	canvasIsVisible (): boolean {
		return document
			.elementFromPoint(this.cursorPosition.x, this.cursorPosition.y)
			.classList.contains('ripple');
	}

	showCursor (cursor: Cursor) {
		document.body.classList.add(cursorMap[cursor]);
		this.currentCursor = cursorMap[cursor];
	}

	hideCursor () {
		if (!this.currentCursor) {
			return;
		}
		document.body.classList.remove(this.currentCursor);
		this.currentCursor = null;
	}
}

export const cursorManager = new CursorManager();