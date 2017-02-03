import {constants} from '../data/constants';

const defaultFlashTime = 1000;

export class SpriteUtil {
	/**
	 * Flashes the sprite red for 1 second
	 *
	 * @param {Object} sprite
	 */
	flashSprite (sprite: any, options?: any) {
		options = options || {};
		const time = options.time;
		const color = options.color || constants.colors.DARK_RED;

		// We don't want the color to get stuck
		const originalTint = sprite.tint !== color ? sprite.tint : constants.colors.WHITE;
		sprite.tint = color;
		setTimeout(function () {
			sprite.tint = originalTint;
		}, time || defaultFlashTime);
	}

	floatSprite (sprite: any) {
		sprite.count = 0;

		const spriteFloatInterval = setInterval(() => {
			if (sprite.count > 20) {
				if (sprite.parent) {
					sprite.parent.removeChild(sprite);
				}
				return clearInterval(spriteFloatInterval);
			}
			sprite.position.y -= 2;
			sprite.count++;
		}, 100);
	}

	showDamageNumber (spriteGroup: any, damage: string, x: number, y: number) {
		const textNode = new PIXI.Text(damage, {
			fontSize: '16px',
			fontFamily: 'Lora',
			fontStyle: 'bold',
			fill: '#c13934',
			stroke: '#000',
			strokeThickness: 2,
			align: 'center'
		});

		if (!spriteGroup._damageNumberCount) {
			spriteGroup._damageNumberCount = 0;
		}
		spriteGroup._damageNumberCount++;

		spriteGroup.addChild(textNode);

		textNode.position.x = x;
		textNode.position.y = y;
		textNode.anchor.x = 0.5;
		textNode.anchor.y = 0.5;

		// Start alternating the x position if there's several damage numbers displayed at once
		switch (spriteGroup._damageNumberCount % 3) {
			case 1:
				textNode.position.x -= 4;
				break;
			case 2:
				textNode.position.x += 4;
				break;
		}

		spriteUtil.floatSprite(textNode);
	}
}

export const spriteUtil = new SpriteUtil();