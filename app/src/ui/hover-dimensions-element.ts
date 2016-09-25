import {constants} from '../data/constants';

export class HoverDimensionsElement {
	element: HTMLElement;
	textNode: HTMLElement;

	constructor (options: any = {}) {
		// Create the element
		this.element = document.createElement('div');
		this.textNode = document.createElement('span');

		this.element.appendChild(this.textNode);

		// Add class(es)
		this.element.classList.add('hover-tile');
		this.element.classList.add('hover-dimensions');

		// Default append it to the canvas-container element
		document.body.appendChild(this.element);

		// Check for scaling
		if (constants.SCALE_UP) {
			// Scale up default css styling by the scaling factor
			var styling = window.getComputedStyle(this.element),
				height = parseInt(styling.height.split('px')[0]);
			this.element.style.height = height * constants.SCALE_FACTOR + 'px';
			this.element.style.width = height * constants.SCALE_FACTOR + 'px';
		}
	}

	show () {
		this.element.style.display = 'block';
	};

	hide () {
		this.element.style.display = 'none';
	};

	setText (text: string) {
		this.textNode.textContent = text;
	};
}