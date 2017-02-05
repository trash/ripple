import _ = require('lodash');
import {Task, ITaskOptions} from './task';
import {ResourceRequirements} from '../ResourceRequirements';
import {events} from '../events';
import {IRequiredResources} from '../interfaces';
import {Profession} from '../data/profession';
import {CraftTask as CraftTaskAction} from '../b3/actions/Tasks/CraftTask';
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
    item: string;
    profession: Profession;
	resourceRequirements: ResourceRequirements;

	constructor (options: ITaskOptions, item: string) {
        const itemData = assemblageData[item];
		const resourceRequirements = new ResourceRequirements(
            itemData.craftable.requiredResources
        );
		options.behaviorTree = new CraftTaskAction(item, resourceRequirements);

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

		return this.resourceRequirements.claimedResourcesExist();
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