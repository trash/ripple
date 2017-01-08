import {events} from './events';
import {IResourceRequirementsMap, IResourceRequirementsMapEntry, IRequiredResources,
	IItemSearchResult} from './interfaces';
import {EventEmitter2} from 'eventemitter2';

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
	map: IResourceRequirementsMap;

	constructor (resources: IRequiredResources) {
		super();
		this.map = {};

		for (let resource in resources) {
			this.map[resource] = {
				gathered: 0,
				required: resources[resource]
			};
		}
	}

	forEach(callback: ForEachCallback) {
		Object.keys(this.map).forEach(resourceType => {
			callback(resourceType, this.map[resourceType]);
		});
	}

	toString(): string {
		let string = '';
		this.forEach((resourceType, resourceEntry) => {
			string += `${resourceType}:[${resourceEntry.gathered}/${resourceEntry.required}]`;
		})
		return string;
	}

	/**
	 * Adds a resource to the list of gathered resources of the given resource type
	 *
	 * @param {Item} resource A resource item that has been gathered for the requirements
	 *                        and needs to be removed from the game (used).
	 */
	addToRequirements (itemSearchResult: IItemSearchResult) {
		// Update our gathered amount
		this.map[itemSearchResult.state.name].gathered += 1;

		// Update the resources service
		events.emit('remove-from-resource', itemSearchResult.id);

		// trigger appropriate sound
		events.emit(['trigger-sound', 'resourceDrop'])

		this.emit('add', itemSearchResult);
	}

	/**
	 * Pick a random (first one found) resource that needs to be gathered
	 *
	 * @return {String} The name of the picked resource
	 */
	pickRequiredResource (): string {
		let resourceToGather: string;
		Object.keys(this.map).some(resource => {
			if (this.map[resource].required > this.map[resource].gathered) {
				resourceToGather = resource;
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
	claimedResourcesExist () {
		// Since this returns true if there ISNT the proper amount, we want to return the opposite
		return !Object.keys(this.map).some(resourceType => {
			let amountLeft = this.map[resourceType].required - this.map[resourceType].gathered;
			debugger;
			// Basically check if the required amount of resource exists and if it doesn't then return true
			// NOTE: make sure to take into account the amount that have already been gathered
			// if (!gameManager.itemManager.claimedResourceExists(resourceType, amountLeft)) {
			// 	return true;
			// }
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
		this.forEach((resourceType, resourceEntry) => {
			total += resourceEntry.required - resourceEntry.gathered;
		})
		return total;
	}

	/**
	 * The total amount of resources that are required to have this be built.
	 * Compared with `totalRequiredResources` to tell if you're done.
	 */
	totalNeededResources () {
		let total = 0;
		this.forEach((resourceType, resourceEntry) => {
			total += resourceEntry.required;
		})
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