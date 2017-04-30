import _ = require('lodash');
import {Task, ITaskOptions} from './Task';
import {ItemRequirements} from '../ItemRequirements';
import {events} from '../events';
import {RequiredItems} from '../interfaces';
import {Profession} from '../data/Profession';
import {Item} from '../data/Item';
import {CraftTask as CraftTaskAction} from '../b3/Actions/Tasks/CraftTask';
import {assemblageData} from '../entity/assemblageData/items';
import {buildingUtil} from '../entity/util/building';

/**
* Creates a new CraftTask object.
*
* @classdesc A task associated with crafting an item.
*            1) gather resources 2) bring resources 3) craft item
*
* @extends {Task}
*
* @constructor
* @param {Object} item The item being crafted
*/
export abstract class CraftTask extends Task {
    item: Item;
    profession: Profession;
	resourceRequirements: ItemRequirements;

	constructor (options: ITaskOptions, item: Item) {
        const itemData = assemblageData[item];
		const resourceRequirements = new ItemRequirements(
            itemData.craftable.requiredResources
        );
		options.behaviorTreeRoot = new CraftTaskAction(item, resourceRequirements);

		// Call our parent constructor
		super(options);

        this.profession = itemData.craftable.profession;
		this.resourceRequirements = resourceRequirements;

		// Defaults that should be overwritten by inheriting class
		this.description = 'Crafting an item.';
		this.item = item;

		// Only one person can bake a given item
		this.maxInstancePool = 1;

		this.ready = this.checkIfReady();
		this.bindSuspendEvents();
	}

    bindSuspendEvents() {
        console.info('maybe implement this again later');
    }

	/**
	 * Check if the craft task is ready and return whether it is
	 *
	 * @return {Boolean}
	 */
	checkIfReady () {
		// First check if the craft building exists
		if (!buildingUtil.buildingExistsByProfession(this.profession)) {
			return false;
		}

		return this.resourceRequirements.claimedItemsExist();
	};

	/**
	 * When a craft task is completed we need to update the queued count for the
	 * crafted resource
	 */
	complete () {
		super.complete();

		// Emit event to have resources update the queued value
		events.emit(['resources', 'update-queued'], this.item, -1);
	};
};