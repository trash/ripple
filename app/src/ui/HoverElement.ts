import {constants} from '../data/constants';

export class HoverElement {
	element: HTMLElement;

	constructor (options: {
		noHoverTile?: boolean;
		classes?: string[];
		classList?: string;
	} = {
		noHoverTile: false,
		classes: null,
		classList: null
	}) {
		// Create the element
		this.element = document.createElement('div');

		// Add class(es)
		if (!options.noHoverTile) {
			this.element.classList.add('hover-tile');
		}
		if (options.classes) {
			// Handle single class
			if (typeof options.classList === 'string') {
				options.classes = [options.classList];
			}
			options.classes.forEach(className => {
				this.element.classList.add(className);
			});
		}

		// Default append it to the canvas-container element
		document.body.appendChild(this.element);

		// Check for scaling
		if (constants.SCALE_UP) {
			// Scale up default css styling by the scaling factor
			const styling = window.getComputedStyle(this.element);
			const height = parseInt(styling.height.split('px')[0]);
			this.element.style.height = height * constants.SCALE_FACTOR + 'px';
			this.element.style.width = height * constants.SCALE_FACTOR + 'px';
		}
	}
	show () {
		this.element.style.display = 'block';
	}

	hide () {
		this.element.style.display = 'none';
	}
}