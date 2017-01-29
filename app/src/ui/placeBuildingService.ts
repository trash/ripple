import * as _ from 'lodash';
import {events} from '../events';
import {constants} from '../data/constants';
import {
    ICoordinates,
    IRowColumnCoordinates,
	IEntityComponentData
} from '../interfaces';
import {spriteManager} from '../services/sprite-manager';
import {GameMap} from '../map';

const globalRefs: {
	map: GameMap
} = {
	map: null
};
events.on('map-update', (map: GameMap) => {
	globalRefs.map = map;
});

const TILE_HEIGHT = constants.TILE_HEIGHT;
const colors = constants.colors;

type PlaceBuildingOptions = {
    name: string;
    size: ICoordinates;
	entrance: ICoordinates;
    mustBeNextToWater: boolean;
}

const entityDataToPlaceBuildingOptions = (
	data: IEntityComponentData
): PlaceBuildingOptions => {
	return {
		name: data.building.name,
		size: data.collision.size,
		entrance: data.collision.entrance,
		mustBeNextToWater: data.building.mustBeNextToWater
	};
}

export class PlaceBuildingService {
	hoverSprite: PIXI.Sprite;
	blueprintSprite: HTMLElement;
	building: PlaceBuildingOptions;
	removeCanvasListener: () => void;
	followInterval: () => void;
	active: boolean;
	validPlacement: boolean;
    toggle: (building: IEntityComponentData) => void;

	constructor () {
		this.hoverSprite = null;
		this.blueprintSprite = null;
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

	click (tile: IRowColumnCoordinates) {
        if (!this.active) {
            return;
        }
		if (this.validPlacement) {
            console.info('Place new building', tile, this.building);
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

		const size = buildingData.size;
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
		if (buildingData.entrance) {
			const square = document.createElement('div');
			square.classList.add('blueprint-square');

			square.style.width = `${TILE_HEIGHT}px`;
			square.style.height = `${TILE_HEIGHT}px`;
			square.style.left = buildingData.entrance.x * TILE_HEIGHT
                + 'px';
			square.style.top = buildingData.entrance.y * TILE_HEIGHT
                + 'px';

			container.appendChild(square);
		}

		return container;
	}

	destroyBlueprintSprite () {
		document.body.removeChild(this.blueprintSprite);
	}

	activate (building: PlaceBuildingOptions) {
		this.building = building;
		this.active = true;

		if (!this.hoverSprite) {
			this.hoverSprite = this.createHoverSprite();
		}
		this.hoverSprite.visible = true;

		this.blueprintSprite = this.createBlueprintSprite(building);

		// Emit 'place-building' event so we can cancel out other instances
		events.emit('place-building', this.building);

		// reveal our house and have it follow the mouse
		this.follow();
		// attach our click event
		this.removeCanvasListener = globalRefs.map.addTileClickListener(
            this.click.bind(this));
	}

	deactivate () {
		if (!this.active) {
			return;
		}
		// hide our house and stop it from following the mouse
		this.cancelFollow();

		this.hoverSprite.visible = false;
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
			const mousePosition = {
				x: tile.column,
				y: tile.row
			};
			globalRefs.map.setSpriteToTilePosition(this.hoverSprite, tile);
			globalRefs.map.setElementToTilePosition(this.blueprintSprite, tile);

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
		const buildingSize = this.building.size;
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
		for (let i = 0; i < checkTiles.length; i++) {
			const checkTile = checkTiles[i];
			// it's got a tree, it's inaccessible, or it's got an item and it cna't go there
			// if (checkTile && checkTile.resource || !checkTile.accessible ||
				// checkTile.item || checkTile.isEntrance
            console.info('redo building checks');
            if (!checkTile
			) {
				return false;
			}
		}
		// Check for entrance
		if (this.building.entrance) {
			const entranceTile = globalRefs.map.getTile(mousePosition.y +
				this.building.entrance.y,
                mousePosition.x + this.building.entrance.x);
            console.info('redo entrance check');
			if (!entranceTile
                // || entranceTile.resource
                || !entranceTile.accessible
                // || entranceTile.item
                // || entranceTile.isEntrance
            ) {
				return false;
			}
		}

		// Check if it needs to be next to water
		// If so just make sure one tile is adjacent to water
		if (this.building.mustBeNextToWater) {
            console.info('redo checking if building is next to water');
            return false;
			// return checkTiles.some(tile => tile.isNextToWater());
		}

		return true;
	}
}

export const placeBuildingService = new PlaceBuildingService();