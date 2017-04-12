import {events} from './events';
import {
	IResourceRequirementsMapEntry,
	RequiredResources,
	IItemSearchResult
} from './interfaces';
import {EventEmitter2} from 'eventemitter2';
import {itemUtil} from './entity/util/item';
import {Item} from './data/Item';

type ForEachCallback = (
	resourceType: string,
	resourceEntry: IResourceRequirementsMapEntry
) => void;

/**
* Creates a new ResourceRequirements object.
*
* @classdesc An object that represents all the required resources for a given task/item.
*
* @constructor
* @param {object} resources An map of resource names and the amount required
*                           i.e. { wood: 10, stone: 5 }
*/
export class ResourceRequirements extends EventEmitter2 {
	map: Map<Item, IResourceRequirementsMapEntry>;

	constructor (resources: RequiredResources) {
		super();
		this.map = new Map();

		resources.forEach(resource => {
			this.map.set(resource.enum, {
				gathered: 0,
				required: resource.count
			});
		});
	}

	isCompleted(): boolean {
		// There doesn't exist some entry where the gathered amount is not the
		// required amount
		return !Array.from(this.map).some(([resourceType, resourceEntry]) => {
			return resourceEntry.gathered < resourceEntry.required;
		});
	}

	toString(): string {
		let string = '';
		this.map.forEach((resourceEntry, resourceType) => {
			const resourceName = Item[resourceType];
			string += `${resourceName}:[${resourceEntry.gathered}/${resourceEntry.required}]`;
		});
		return string;
	}

	/**
	 * Method to set all resources as collected. For use when a building is
	 * spawned as already completed.
	 */
	markAsCompleted(): void {
		this.map.forEach(resourceEntry => {
			resourceEntry.gathered = resourceEntry.required;
		});
	}

	/**
	 * Adds a resource to the list of gathered resources of the given resource type
	 *
	 * @param {Item} resource A resource item that has been gathered for the requirements
	 *                        and needs to be removed from the game (used).
	 */
	addToRequirements (itemSearchResult: IItemSearchResult) {
		// Update our gathered amount
		this.map.get(itemSearchResult.state.enum).gathered += 1;

		// Update the resources service
		events.emit('remove-from-resource', itemSearchResult.id);

		// trigger appropriate sound
		events.emit(['trigger-sound', 'resourceDrop']);

		this.emit('add', itemSearchResult);
	}

	/**
	 * Pick a random (first one found) resource that needs to be gathered
	 *
	 * @return {String} The name of the picked resource
	 */
	pickRequiredResource (): Item {
		let resourceToGather: Item;
		Array.from(this.map).some(([resourceType, resourceEntry]) => {
			if (resourceEntry.required > resourceEntry.gathered) {
				resourceToGather = resourceType;
				return true;
			}
		});

		return resourceToGather;
	}

	/**
	 * Returns true if there are enough of the claimed resources in existence
	 * for all required resources.
	 *
	 * @param {Object} resourcesService Reference to the resources service
	 * @return {Boolean}
	 */
	claimedResourcesExist (): boolean {
		// For some resourceType there does not exist the proper count
		return !Array.from(this.map).some(([resourceType, resourceEntry]) => {
			const amountLeft = resourceEntry.required - resourceEntry.gathered;
			const resourceName = itemUtil.getItemNameFromEnum(resourceType);

			// Basically check if the required amount of resource exists and
			// if it doesn't then return true
			// NOTE: make sure to take into account the amount that have already
			// been gathered
			if (!itemUtil.claimedItemCountExists(resourceName, amountLeft)) {
				return true;
			}
			return false;
		});
	}

	/**
	 * Returns the total required resources left to be gathered across all types.
	 *
	 * @return {Number} The number of resources left to be gathered.
	 */
	totalRequiredResources () {
		let total = 0;
		this.map.forEach((resourceEntry) => {
			total += resourceEntry.required - resourceEntry.gathered;
		});
		return total;
	}

	/**
	 * The total amount of resources that are required to have this be built.
	 * Compared with `totalRequiredResources` to tell if you're done.
	 */
	totalNeededResources () {
		let total = 0;
		this.map.forEach((resourceEntry) => {
			total += resourceEntry.required;
		});
		return total;
	}

	/**
	 * Returns the count of different types of resources. I.e. if wood and stone then 2
	 *
	 * @return {Number} Number of different ttypes of resources required
	 */
	resourceTypeCount () {
		return Object.keys(this.map).length;
	}
}