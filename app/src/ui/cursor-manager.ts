interface ICursorMap {
	[index: string]: string
}

export class CursorManager {
	cursors: ICursorMap;
	cursorPosition: {
		x: number,
		y: number
	}
	currentCursor: string;

	constructor () {
		this.cursors = {
			hand: 'hand-cursor',
			attack: 'attack-cursor',
			harvest: 'harvest-cursor',
			cancelHarvest: 'cancel-harvest-cursor'
		};
		document.body.addEventListener('mousemove', event => {
			this.cursorPosition = {
				x: event.pageX,
				y: event.pageY
			};
		});
	}

	canvasIsVisible (): boolean {
		return document.elementFromPoint(this.cursorPosition.x, this.cursorPosition.y)
			.classList.contains('ripple');
	};

	showCursor (cursor: string) {
		document.body.classList.add(this.cursors[cursor]);
		this.currentCursor = cursor;
	};
	hideCursor () {
		if (!this.currentCursor) {
			return;
		}
		document.body.classList.remove(this.cursors[this.currentCursor]);
		this.currentCursor = null;
	};
}

export const cursorManager = new CursorManager();