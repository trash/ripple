import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {IHarvestableState, HarvestTypesEnum} from '../components/harvestable';
import {IRenderableState} from '../components/renderable';
import {IPositionState} from '../components/position';
import {util} from '../../util';
import {events} from '../../events';
import {keybindings} from '../../services/keybindings';
import {HoverElement} from '../../ui/hover-element';
import {dragSelect} from '../../ui/drag-select';
import {cursorManager} from '../../ui/cursor-manager';
import {EventEmitter2} from 'eventemitter2';
import {taskQueueManager} from '../../Tasks/TaskQueueManager';
import {GameMap} from '../../map';
import {IRowColumnCoordinates} from '../../interfaces';

const globalRefs: {
	map: GameMap
} = {
	map: null
};
events.on('map-update', (map: GameMap) => {
	globalRefs.map = map;
});


export class HarvestSelectSystem extends EntitySystem {
    harvestTypes: HarvestTypesEnum[];
    hoverListener: Function;
    cancel: Function;
    tileHoverElement: HoverElement;
    tiles: IRowColumnCoordinates[];
	highlighted: IHarvestableState[];
    active: boolean;

    constructor (manager: EntityManager, componentEnum: ComponentEnum) {
		super(manager, componentEnum);
        this.active = false;
		this.tileHoverElement = new HoverElement();
        this.harvestTypes = [HarvestTypesEnum.tree, HarvestTypesEnum.food];
		this.tiles = null;
		this.highlighted = [];

		events.on('toggle-harvest-type', this.toggleHarvestType.bind(this));

		// Bind this action to the h key
		keybindings.addKeyListener('h', () => {
			this.toggle();
		});
    }

    update (entityIds: number[]) {
		this.highlighted.forEach(harvestableState => {
			harvestableState.highlighted = false;
		});
		this.highlighted = [];

		if (!this.tiles) {
			return;
		}
        const selectedEntityIds = this.getSelectedEntities();

        selectedEntityIds.forEach(id => {
            const harvestableState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Harvestable, id) as IHarvestableState;

			harvestableState.highlighted = true;
			this.highlighted.push(harvestableState);
        });
    }

	queueUpHarvestTasks () {
		if (!this.tiles) {
			return;
		}
		const entityIds = this.getSelectedEntities();
		entityIds.forEach(id => {
			const harvestableState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Harvestable, id) as IHarvestableState;
			console.info(`queue up HarvestTask for entity with id: ${id}`);
			harvestableState.queued = true;

			const professionTaskQueue = taskQueueManager.professionTaskQueue(harvestableState.profession);
			harvestableState.task = professionTaskQueue.push(id);
		});
	}

	/**
	 * Returns the list of entity ids for entities currently selected
	 * by the HarvestSelectSystem's selection area.
	 *
	 * @returns [Number] The list of entity ids
	 */
	getSelectedEntities (): number[] {
		const entityIds = this.manager.getEntityIdsForComponent(ComponentEnum.Resource);

        return entityIds.filter(id => {
            const positionState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Position, id) as IPositionState;
			return this.tiles.includes(positionState.tile);
        });
	}

    toggleHarvestType (harvestType: HarvestTypesEnum) {
		let indexOf = this.harvestTypes.indexOf(harvestType);
		if (indexOf !== -1) {
			this.harvestTypes.splice(indexOf, 1);
		} else {
			this.harvestTypes.push(harvestType);
		}
		events.emit('harvest-types-updated', this.harvestTypes);
	}

    toggle (destroy: boolean = false, cancelHarvest: boolean = false): boolean {
		if (this.hoverListener) {
			this.hoverListener();
			this.hoverListener = null;
		}
		// If dragselect is active, we toggle it off by calling the this.cancel function
		if (this.cancel) {
			return this.turnOff();
		}
		return this.turnOn(destroy, cancelHarvest);
	}

    turnOn (destroy: boolean, cancelHarvest: boolean): boolean {
		cursorManager.showCursor(cancelHarvest ? 'cancelHarvest' : 'harvest');

		this.tileHoverElement.show();

		// Highlight the currrently hovered over tile
		this.hoverListener = globalRefs.map.addTileHoverListener(tile => {
			globalRefs.map.setElementToTilePosition(this.tileHoverElement.element, tile);
		});

		// Start the drag select
		this.cancel = dragSelect(tiles => {
            this.tiles = tiles;
		}, tiles => {
			this.queueUpHarvestTasks();
            this.tiles = null;
			this.tileHoverElement.show();
		}, true);

		return this.active;
	}

    turnOff (): boolean {
		this.cancel();
		this.cancel = null;

		cursorManager.hideCursor();

		// Hide the element when we this.cancel it
		this.tileHoverElement.hide();
		return this.active;
	}
}