import * as TWEEN from 'tween.js';
import * as _ from 'lodash';
import {events} from '../events';
import {util} from '../util';
import {GameMap} from '../map';
import {globalRefs} from '../globalRefs';
import {IRowColumnCoordinates} from '../interfaces';
import {spriteManager} from '../services/sprite-manager';
import {positionUtil} from '../entity/util';
import {Component} from '../entity/ComponentEnum';

const spritePosition = {
    offsetX: 10,
    offsetY: 5,
    baseY: 0,
    maxOffsetY: -10
}

export class SelectedEntityCursorService {
    hoverSprite: PIXI.Sprite;
    hoverSpriteInterval: number;
    clickListenerOff: Function;
    selectedEntity: number;

    constructor() {
        events.on('map-update', (map: GameMap) => {
            // Defer so that the tilemap is created
            _.defer(() => {
                if (this.hoverSprite) {
                    spriteManager.destroyHoverSprite(this.hoverSprite);
                    clearInterval(this.hoverSpriteInterval)
                }
                this.hoverSprite = this.createHoverSprite();
            });
            this.updateMap(map);
        });
    }

    updateMap (map: GameMap) {
        this.clickListenerOff = map.addTileClickListener(tile => this.onTileClick(tile));
    }

    onTileClick(tile: IRowColumnCoordinates) {
        if (!this.hoverSprite) {
            return;
        }
        const hoveredEntity = positionUtil.getEntitiesWithComponentInTile(
            tile,
            Component.Position
        )[0];
        this.selectedEntity = hoveredEntity;
        this.hoverSprite.visible = !!hoveredEntity;
        if (hoveredEntity) {
            const coords = globalRefs.map.getSpritePositionFromTile(tile);
            spritePosition.baseY = coords.y;
            this.hoverSprite.x = coords.x + spritePosition.offsetX;
            this.hoverSprite.y = spritePosition.baseY
                + spritePosition.offsetY;
        }
    }

    createHoverSprite (): PIXI.Sprite {
		// Create and hide our hover house
		const hoverSprite = spriteManager.createHoverSprite('standard');
        // Rotate it so it points down
        hoverSprite.rotation = util.degreesToRadians(-135);
		hoverSprite.visible = false;
		// Make it slightly opaque
		hoverSprite.alpha = 0.65;

        const service = this;

        const tween = new TWEEN.Tween(spritePosition)
            .to({ offsetY: spritePosition.maxOffsetY }, 1000)
            .repeat(Infinity)
            .delay(50)
            .yoyo(true)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {
                spritePosition.offsetY = this.offsetY;
                service.hoverSprite.y = spritePosition.baseY
                    + spritePosition.offsetY;
            })
            .start();

        return hoverSprite;
	}
}