import {util} from '../util';
import {Tilemap, TilemapSprite} from '../tilemap';
import {ICoordinates} from '../interfaces';

interface ITextOptions {
	font?: string;
	fill?: number | string;
	align?: string;
	fontSize?: number;
	stroke: string;
	strokeThickness: number;
}

export interface ISpriteText extends PIXI.Sprite {
	actualWidth?: number;
}

export class SpriteManager {
	tilemap: Tilemap;

	constructor () {
		this.tilemap = null;
	}

	getTileSize (): number {
		return this.tilemap.getTileSize();
	}


	create (
		name: string,
		column: number,
		row: number,
		outsideTilemap = false
	): PIXI.Sprite {
		if (!this.tilemap) {
			console.error('SpriteManager does not have a tilemap.');
		}

		var sprite = PIXI.Sprite.fromFrame(name);

		if (!outsideTilemap) {
			this.tilemap.addChildToPosition(sprite as TilemapSprite, column, row);
		}

		return sprite;
	}

	createText (
		text: string,
		options: ITextOptions,
		column: number,
		row: number
	): ISpriteText {
		let fill = options.fill || 0xff1010,
			align = options.align || 'center',
			fontSize = options.fontSize || 16;

		let font = `${fontSize}px Arial`,
			textSprite: ISpriteText = new PIXI.Text(text, {
				font: font,
				fill: fill,
				align: align,
				stroke: options.stroke,
				strokeThickness: options.strokeThickness
			});
		textSprite.actualWidth = util.getTextWidth(text, font);

		return textSprite;
	}

	createHoverSprite (name: string): any {
		var sprite = PIXI.Sprite.fromFrame(name);

		this.tilemap.hoverLayer.addChild(sprite);

		return sprite;
	}

	createContainer (
		column: number,
		row: number,
		layerIndex?: number
	): PIXI.Container {
		if (!this.tilemap) {
			console.error('SpriteManager does not have a tilemap.');
		}

		const container = new PIXI.Container() as TilemapSprite;

		this.tilemap.addChildToPosition(container, column, row, layerIndex);

		return container;
	}

	subContainerWillUpdate (
		sprite: TilemapSprite,
		x: number,
		y: number
	): boolean {
		return this.tilemap.subContainerWillUpdate(sprite, x, y);
	}

	changePosition (
		sprite: PIXI.DisplayObject,
		column: number,
		row: number,
		dontUpdate: boolean = false
	): any {
		return this.tilemap.changeChildPosition(sprite as TilemapSprite, column, row, dontUpdate);
	}

	positionFromTile (
		column: number,
		row: number
	): ICoordinates {
		return this.tilemap.positionFromTile(column, row);
	}

	setSpritePositionFromTile (
		sprite: TilemapSprite,
		column: number,
		row: number
	) {
		this.tilemap.setSpritePositionFromTile(sprite, column, row);
	}

	destroy (sprite: TilemapSprite) {
		sprite.destroyed = true;

		this.tilemap.removeChildFromSubContainer(sprite);

		sprite.destroy();
	}

	setTilemap (tilemap: any) {
		this.tilemap = tilemap;
	}
}

export const spriteManager = new SpriteManager();