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

const spriteOffsets = {
    x: 10,
    y: 5,
    maxY: -10
}

export class SelectedEntityCursorService {
    hoverSprite: PIXI.Sprite;
    hoverSpriteInterval: number;
    hoverListenerOff: Function;
    currentTile


    constructor() {

        events.on('map-update', (map: GameMap) => {
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
        this.hoverListenerOff = map.addTileHoverListener(tile => this.onTileHover(tile));
    }

    onTileHover(tile: IRowColumnCoordinates) {
        const hoveredEntity = positionUtil.getEntitiesWithComponentInTile(
            tile,
            Component.Position
        )[0];

        globalRefs.map.setSpriteToTilePosition(this.hoverSprite, tile);
        this.hoverSprite.position.x += spriteOffsets.x;
        this.hoverSprite.position.y += spriteOffsets.y;
    }

    createHoverSprite (): PIXI.Sprite {
		// Create and hide our hover house
		const hoverSprite = spriteManager.createHoverSprite('standard');
        // Rotate it so it points down
        hoverSprite.rotation = util.degreesToRadians(-135);
		// hoverSprite.visible = false;
		// Make it slightly opaque
		hoverSprite.alpha = 0.65;

        const tween = new TWEEN.Tween(spriteOffsets)
            .to({ y: spriteOffsets.maxY }, 1000)
            .repeat(Infinity)
            .delay(50)
            .yoyo(true)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {
                spriteOffsets.y = this.y;
            })
            .start();

        return hoverSprite;
	}
}