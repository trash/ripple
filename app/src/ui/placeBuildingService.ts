import * as _ from 'lodash';
import {globalRefs} from '../globalRefs';
import {events} from '../events';
import {constants} from '../data/constants';
import {
    ICoordinates,
    IRowColumnCoordinates,
	IEntityComponentData
} from '../interfaces';
import {spriteManager} from '../services/sprite-manager';
import {EntityManager} from '../entity/entityManager';
import {EntitySpawner} from '../entity/entitySpawner';
import {Component} from '../entity/ComponentEnum';
import {ICollisionState, IPositionState} from '../entity/components';
import {collisionUtil} from '../entity/util/collision';
import {mapUtil} from '../entity/util/map';
import {Building} from '../data/Building';

const TILE_HEIGHT = constants.TILE_HEIGHT;
const colors = constants.colors;

type PlaceBuildingOptions = {
    name: string;
	enum: Building;
    mustBeNextToWater: boolean;
	collision: ICollisionState;
}

const entityDataToPlaceBuildingOptions = (
	data: IEntityComponentData
): PlaceBuildingOptions => {
	return {
		name: data.building.name,
		enum: data.building.enum,
		mustBeNextToWater: data.building.mustBeNextToWater,
		collision: data.collision
	};
}

export class PlaceBuildingService {
	hoverSprite: PIXI.Sprite;
	blueprintSprite: HTMLElement;
	entity: number;
	building: PlaceBuildingOptions;
	removeCanvasListener: () => void;
	followInterval: () => void;
	active: boolean;
	validPlacement: boolean;
    toggle: (building: IEntityComponentData) => void;
	entityManager: EntityManager;
	entitySpawner: EntitySpawner;

	constructor () {
		this.hoverSprite = null;
		this.blueprintSprite = null;
		this.entity = null;
		this.building = null;
		this.removeCanvasListener = null;
		this.followInterval = null;
		this.active = false;
		this.validPlacement = false;
        // This is to stop the initial click that selects the building
		// from trigger a placement at the same time
        this.toggle = (building: IEntityComponentData) => _.defer(() =>
            this._toggle(building));
	}

	setEntityManager (entityManager: EntityManager) {
		this.entityManager = entityManager;
	}
	setEntitySpawner (entitySpawner: EntitySpawner) {
		this.entitySpawner = entitySpawner;
	}

	click (tile: IRowColumnCoordinates) {
        if (!this.active) {
            return;
        }
		if (this.validPlacement) {
			this.entitySpawner.spawnBuilding(this.building.enum, false, null, {
				position: {
					tile: tile
				}
			});
		}
	}

	_toggle (buildingData: IEntityComponentData) {
		const building = entityDataToPlaceBuildingOptions(buildingData);
        if (this.active) {
            this.deactivate();
            // They selected a different building so activate that one
            if (building.name !== this.building.name) {
                this.activate(building);
                return;
            }
        } else {
            this.activate(building);
        }
	}

	createBlueprintSprite (buildingData: PlaceBuildingOptions): HTMLElement {
		const container = document.createElement('div');
		container.classList.add('building-blueprint-sprite');
		document.body.appendChild(container);

		const size = buildingData.collision.size;
		for (let x = 0; x < size.x; x++) {
			for (let y = 0; y < size.y; y++) {
				const square = document.createElement('div');
				square.classList.add('blueprint-square');

				square.style.width = TILE_HEIGHT + 'px';
				square.style.height = TILE_HEIGHT + 'px';
				square.style.left = x * TILE_HEIGHT + 'px';
				square.style.top = y * TILE_HEIGHT + 'px';

				container.appendChild(square);
			}
		}

		// Check for entrance
		if (buildingData.collision.entrance) {
			const square = document.createElement('div');
			square.classList.add('blueprint-square');

			square.style.width = `${TILE_HEIGHT}px`;
			square.style.height = `${TILE_HEIGHT}px`;
			square.style.left = buildingData.collision.entrance.x * TILE_HEIGHT
                + 'px';
			square.style.top = buildingData.collision.entrance.y * TILE_HEIGHT
                + 'px';

			container.appendChild(square);
		}

		return container;
	}

	destroyBlueprintSprite () {
		document.body.removeChild(this.blueprintSprite);
	}

	createEntity (collisionData: ICollisionState): number {
		const entityId = this.entityManager.createEntity([
			Component.Collision,
			Component.Position
		]);

		const collisionState = this.entityManager.getComponentDataForEntity(
				Component.Collision, entityId) as ICollisionState;
		_.extend(collisionState, collisionData);
		collisionState.updatesTile = false;

		return entityId;
	}

	activate (building: PlaceBuildingOptions) {
		this.building = building;
		this.active = true;

		this.entity = this.createEntity(building.collision);

		this.hoverSprite = this.createHoverSprite();
		this.hoverSprite.visible = true;

		this.blueprintSprite = this.createBlueprintSprite(building);

		// Emit 'place-building' event so we can cancel out other instances
		events.emit('place-building', this.building);

		// reveal our house and have it follow the mouse
		this.follow();
		// attach our click event
		this.removeCanvasListener = globalRefs.map.addTileClickListener(
            (tile: IRowColumnCoordinates) => this.click(tile));
	}

	deactivate () {
		if (!this.active) {
			return;
		}
		// hide our house and stop it from following the mouse
		this.cancelFollow();

		this.entityManager.destroyEntity(this.entity);
		this.entity = null;

		spriteManager.destroyHoverSprite(this.hoverSprite);

		this.active = false;

		this.destroyBlueprintSprite();

		// remove our click event
		if (!this.removeCanvasListener) {
			debugger;
			return;
		}
		this.removeCanvasListener();
		this.removeCanvasListener = null;
	}

	follow () {
		this.followInterval = globalRefs.map.addTileHoverListener(tile => {
			globalRefs.map.setSpriteToTilePosition(this.hoverSprite, tile);
			globalRefs.map.setElementToTilePosition(this.blueprintSprite, tile);

			// Update the position state for the entity
			const positionState = this.entityManager.getComponentDataForEntity(Component.Position,
				this.entity) as IPositionState;
			positionState.tile = tile;

			const mousePosition = {
				x: tile.column,
				y: tile.row
			};
			// If it's not a valid position color the tile red
			this.validPlacement = this.isValidPlacement(mousePosition);
			if (!this.validPlacement) {
				this.hoverSprite.tint = colors.RED;
			}
			else {
				this.hoverSprite.tint = colors.WHITE;
			}
		});
	}

	cancelFollow () {
		if (this.followInterval) {
			this.followInterval();
		}
	}

	createHoverSprite (): PIXI.Sprite {
		// Create and hide our hover house
		const hoverSprite = spriteManager.createHoverSprite(this.building.name);
		hoverSprite.visible = false;
		// Make it slightly opaque
		hoverSprite.alpha = 0.65;
        return hoverSprite;
	}

	/**
	* Returns whether or not a given tile is a valid placement for a building
	*
	* @param  {Object} mousePosition x, y position of the starting tile for the building
	* @return {boolean} Whether or not the position is valid
	*/
	isValidPlacement (mousePosition: ICoordinates): boolean {
		const buildingSize = this.building.collision.size;
		const checkTiles: IRowColumnCoordinates[] = [];

		for (let x = mousePosition.x;
            x < mousePosition.x + buildingSize.x; x++
        ) {
			for (let y = mousePosition.y;
                y < mousePosition.y + buildingSize.y; y++
            ) {
				checkTiles.push(globalRefs.map.getTile(y, x));
			}
		}

		// Check for all tiles covered by size
		const collisionTiles = collisionUtil.getTilesFromCollisionEntity(
			this.entity);
		const collisionDetected = collisionTiles.some(tile => {
			const occupiedTile = mapUtil.getTile(tile.row, tile.column);
			if (!occupiedTile) {
				return false;
			}
			return occupiedTile.collision;
		});
		if (collisionDetected) {
			return false;
		}

		// Check if it needs to be next to water
		// If so just make sure one tile is adjacent to water
		if (this.building.mustBeNextToWater) {
            console.info('redo checking if building is next to water');
			// return checkTiles.some(tile => tile.isNextToWater());
            return false;
		}

		return true;
	}
}

export const placeBuildingService = new PlaceBuildingService();