import TWEEN = require('tween.js');
import {EntitySystem, EntityManager} from '../entityManager';
import {IRenderableState} from '../components';
import {IPositionState} from '../components';
import {positionUtil} from '../util/position';
import {ICoordinates} from '../../interfaces';
import {util} from '../../util';
import {TilemapSprite} from '../../tilemap';
import {constants} from '../../data/constants';
import {Components} from '../ComponentsEnum';
import {spriteManager} from '../../services/sprite-manager';

export class RenderableSystem extends EntitySystem {
    update (entityIds: number[], turn: number) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
					Components.Renderable, id) as IRenderableState;
			const positionState = this.manager.getComponentDataForEntity(
					Components.Position, id) as IPositionState;

			if (!renderableState.spriteGroup) {
				renderableState.spriteGroup = spriteManager.createContainer(
					positionState.tile.column, positionState.tile.row);
			}

			// Stop updating sprites that shouldn't be shown
			if (!renderableState.shown) {
				renderableState.spriteGroup.visible = false;
				return;
			// Show sprites again
			} else if (!renderableState.spriteGroup.visible) {
				renderableState.spriteGroup.visible = true;
			}
			// Wait for position system to bootstrap this
			if (!positionState.previousTile) {
				return;
			}

			let lastPosition = spriteManager.positionFromTile(
					positionState.previousTile.column, positionState.previousTile.row);
			let newPosition = spriteManager.positionFromTile(
					positionState.tile.column, positionState.tile.row);

			// We always need to update moving sprites to make sure their
			// z-index is up to date (so they don't appear behind things wrong)
			if (!util.coordinatesAreEqual(newPosition, lastPosition)) {
				spriteManager.changePosition(renderableState.spriteGroup,
					positionState.tile.column, positionState.tile.row, true);
			}

			// Don't re-render thousands of things on the map that don't move (like resources)
			if (spriteManager.subContainerWillUpdate(renderableState.spriteGroup as TilemapSprite,
				positionState.tile.column, positionState.tile.row
			)) {
				const changedSubContainer = spriteManager.changePosition(renderableState.spriteGroup,
					positionState.tile.column, positionState.tile.row, true);
				// If the sprite changed subcontainers we need to manually update the spritegroup position so it tweens properly from one subcontainer to the next
				// Otherwise we have jumping sprites
				if (changedSubContainer) {
					const direction = positionUtil.directionToTile(positionState.previousTile, positionState.tile);
					const tileSize = spriteManager.getTileSize();

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
			}

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
			Components.Renderable, id) as IRenderableState;

		spriteManager.destroy(renderableState.spriteGroup as TilemapSprite);
	}
}