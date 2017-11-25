import * as TWEEN from 'tween.js';
import {EntitySystem, EntityManager} from '../entityManager';
import {IRenderableState} from '../components';
import {IPositionState} from '../components';
import {positionUtil} from '../util/position';
import {XYCoordinates} from '../../interfaces';
import {util} from '../../util';
import {TilemapSprite, SubContainerLayer} from '../../tilemap';
import {constants} from '../../data/constants';
import {Component} from '../ComponentEnum';
import {spriteManager} from '../../services/spriteManager';

export class RenderableSystem extends EntitySystem {
	filterEntities(id: number): boolean {
		const renderableState = this.manager.getComponentDataForEntity(
			Component.Renderable,
			id
		) as IRenderableState;
		if (renderableState.dirty) {
			renderableState.dirty = false;
			return true;
		}
		const positionState = this.manager.getComponentDataForEntity(
			Component.Position,
			id
		) as IPositionState;
		return positionState.dirty;
	}

    update (entityIds: number[], turn: number) {
        entityIds.filter(id => this.filterEntities(id)).forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
				Component.Renderable,
				id
			) as IRenderableState;
			const positionState = this.manager.getComponentDataForEntity(
				Component.Position,
				id
			) as IPositionState;

			if (!renderableState.spriteGroup) {
				renderableState.spriteGroup = spriteManager.createContainer(
					positionState.tile.column, positionState.tile.row
				);
			}

			// If we need to optimize this we need to add another value to the state.
			// Checking the current value of renderableState.spriteGroup.visible
			// doesn't seem to work. It causes flickering. My guess is it's because
			// that value isn't actually updated instantly due to PIXI being on a fixed
			// update time.
			if (!renderableState.shown) {
				renderableState.spriteGroup.visible = false;
				return;
			// Show sprites again
			} else {
				renderableState.spriteGroup.visible = true;
			}
			// Wait for position system to bootstrap this
			if (!positionState.previousTile) {
				return;
			}

			let lastPosition = spriteManager.positionFromTile(
				positionState.previousTile.column, positionState.previousTile.row
			);
			let newPosition = spriteManager.positionFromTile(
				positionState.tile.column, positionState.tile.row
			);

			let coordsChanged = false;

			if (!renderableState.lastRenderedCoordinates
				|| !util.coordinatesAreEqual(
					newPosition, renderableState.lastRenderedCoordinates
				)
			) {
				renderableState.lastRenderedCoordinates = newPosition;
				coordsChanged = true;
			}

			const positionHasChanged = !util.coordinatesAreEqual(newPosition, lastPosition);
			const spritePositionHasChanged =
				newPosition.x !== renderableState.spriteGroup.position.x
				|| newPosition.y !== renderableState.spriteGroup.position.y;

			// Handle transitioning between subcontainers
			const currentIndex = (renderableState.spriteGroup.parent as SubContainerLayer).index;
			if (currentIndex !== renderableState.lastSubContainerLayerIndex
				|| renderableState.activeSubContainerTransition) {
				lastPosition = this.handleSubContainerChange(
					renderableState,
					positionState,
					newPosition,
					lastPosition
				);
				renderableState.activeSubContainerTransition = true;
			}
			renderableState.lastSubContainerLayerIndex = currentIndex;

			// We always need to update moving sprites to make sure their
			// z-index is up to date (so they don't appear behind things wrong)
			if (coordsChanged) {
				spriteManager.changePosition(renderableState.spriteGroup,
					positionState.tile.column, positionState.tile.row, true
				);
			}

			// NOTE: this used to be an OR. not sure why
			if (!positionHasChanged && !spritePositionHasChanged) {
				renderableState.activeSubContainerTransition = false;
				positionState.dirty = false;
				return;
			}

			let percentageTravelled = (turn - positionState.turnUpdated)
				/ (positionState.turnCompleted - positionState.turnUpdated);
			percentageTravelled = TWEEN.Easing.Quartic.Out(percentageTravelled);

			// We need to add some math here to get an Easing Cubic In function to make the animation less linear
			const calculatedNewPosition = {
				x: lastPosition.x + (newPosition.x - lastPosition.x) * percentageTravelled,
				y: lastPosition.y + (newPosition.y - lastPosition.y) * percentageTravelled
			};

			// Make sure we turn off any active subcontainer transitions
			if (turn >= positionState.turnCompleted) {
				renderableState.activeSubContainerTransition = false;
				positionState.dirty = false;
			}

			renderableState.spriteGroup.position.x = calculatedNewPosition.x;
			renderableState.spriteGroup.position.y = calculatedNewPosition.y;
        });
    }

	handleSubContainerChange(
		renderableState: IRenderableState,
		positionState: IPositionState,
		newPosition: XYCoordinates,
		lastPosition: XYCoordinates
	): XYCoordinates {
		const direction = positionUtil.directionToTile(
			positionState.previousTile,
			positionState.tile
		);
		const tileSize = spriteManager.getTileSize();
		let x = lastPosition.x;
		let y = lastPosition.y;

		switch (direction) {
			case 'left':
				// at left side of container moving to right isde of new container
				x = newPosition.x + tileSize;
				break;
			case 'right':
				// at right side of container moving to left side of new container
				x = newPosition.x - tileSize;
				break;
			case 'down':
				// at the bottom of last container moving to top of new one
				y = newPosition.y - tileSize;
				break;
			case 'up':
				// at the top of last container moving up to bottom of new container
				y = newPosition.y + tileSize;
				break;
		}

		return { x, y };
	}

	destroyComponent (id: number) {
		const renderableState = this.manager.getComponentDataForEntity(
			Component.Renderable, id) as IRenderableState;

		spriteManager.destroy(renderableState.spriteGroup as TilemapSprite);
	}
}