import TWEEN = require('tween.js');
import {EntitySystem, EntityManager} from '../entity-manager';
import {IRenderableState} from '../components/renderable';
import {IPositionState} from '../components/position';
import {gameManager} from '../../game/game-manager';
import {ICoordinates} from '../../interfaces';
import {util} from '../../util';
import {TilemapSprite} from '../../tilemap';
import {constants} from '../../constants';
import {ComponentEnum} from '../component-enum';

export class RenderableSystem extends EntitySystem {
    update (entityIds: number[], turn: number) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
					ComponentEnum.Renderable, id) as IRenderableState,
				positionState = this.manager.getComponentDataForEntity(
					ComponentEnum.Position, id) as IPositionState;

			if (!renderableState.spriteGroup) {
				renderableState.spriteGroup = gameManager.sprites.createContainer(
					positionState.tile.column, positionState.tile.row);
			}

			// Stop updating sprites that shouldn't be shown
			if (!renderableState.shown) {
				renderableState.spriteGroup.visible = false;
				return;
			}
			// Wait for position system to bootstrap this
			if (!positionState.previousTile) {
				return;
			}

			let lastPosition = gameManager.sprites.positionFromTile(
					positionState.previousTile.column, positionState.previousTile.row),
				newPosition = gameManager.sprites.positionFromTile(
					positionState.tile.column, positionState.tile.row);

			// This was an optimization that may no longer be needed
			// if (gameManager.sprites.subContainerWillUpdate(renderableState.spriteGroup as TilemapSprite,
			// 	positionState.tile.column, positionState.tile.row
			// )) {
			const changedSubContainer = gameManager.sprites.changePosition(renderableState.spriteGroup,
				positionState.tile.column, positionState.tile.row, true);
			// If the sprite changed subcontainers we need to manually update the spritegroup position so it tweens properly from one subcontainer to the next
			// Otherwise we have jumping sprites
			if (changedSubContainer) {
				const direction = positionState.previousTile.directionToTile(positionState.tile);

				const tileSize = gameManager.sprites.getTileSize();

				switch (direction) {
					case 'left':
						// at left side of container moving to right isde of new container
						renderableState.spriteGroup.position.x = newPosition.x + tileSize;
						break;
					case 'right':
						// at right side of container moving to left side of new container
						renderableState.spriteGroup.position.x = newPosition.x - tileSize;
						break;
					case 'down':
						// at the bottom of last container moving to top of new one
						renderableState.spriteGroup.position.y = newPosition.y - tileSize;
						break;
					case 'up':
						// at the top of last container moving up to bottom of new container
						renderableState.spriteGroup.position.y = newPosition.y + tileSize;
						break;
				}

				lastPosition = {
					x: renderableState.spriteGroup.position.x,
					y: renderableState.spriteGroup.position.y
				};
			}
			// }

			if (util.coordinatesAreEqual(lastPosition, newPosition) ||
				(newPosition.x === renderableState.spriteGroup.position.x &&
					newPosition.y === renderableState.spriteGroup.position.y)) {
				return;
			}

			let percentageTravelled = (turn - positionState.turnUpdated) / (positionState.turnCompleted - positionState.turnUpdated);
			percentageTravelled = TWEEN.Easing.Quartic.Out(percentageTravelled);

			// We need to add some math here to get an Easing Cubic In function to make the animation less linear
			const calculatedNewPosition = {
				x: lastPosition.x + (newPosition.x - lastPosition.x) * percentageTravelled,
				y: lastPosition.y + (newPosition.y - lastPosition.y) * percentageTravelled
			};

			renderableState.spriteGroup.position.x = calculatedNewPosition.x;
			renderableState.spriteGroup.position.y = calculatedNewPosition.y;
        });
    }
	destroyComponent (id: number) {
		const renderableState = this.manager.getComponentDataForEntity(
			ComponentEnum.Renderable, id) as IRenderableState;

		gameManager.sprites.destroy(renderableState.spriteGroup as TilemapSprite);
	}
}