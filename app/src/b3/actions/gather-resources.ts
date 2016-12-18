import {dropOffTargetKeyOrFunctionType} from '../../interfaces';
import {Sequence} from '../core/sequence';
import {MemPriority} from '../core/mem-priority';
import {MemSequence} from '../core/mem-sequence';
import {Inverter} from '../core/inverter';
import {GoToTarget} from './go-to-target';
import {PickupItem} from './pickup-item';
import {AllResourcesGathered} from './all-resources-gathered';
import {AddResourceToRequirements} from './add-resource-to-requirements';
import {GetRequiredResource} from './get-required-resource';
import {ClearBlackboardValue} from './clear-blackboard-value';
import {BlackboardValueExists} from './blackboard-value-exists';
import {ResourceRequirements} from '../../resource-requirements';

const requiredResourceKey = 'required-resource';
const goToTargetKey = 'required-resource-go-to-target';

export class GatherResources extends Sequence {
	constructor (
		requiredResources: ResourceRequirements,
		dropOffLocation: dropOffTargetKeyOrFunctionType
	) {
		super({
			children: [
				new MemPriority({
					children: [
						new Inverter({
							child: new Sequence({
								children: [
									new Inverter({
										child: new BlackboardValueExists(requiredResourceKey)
									}),
									new GetRequiredResource(requiredResourceKey, goToTargetKey, requiredResources, dropOffLocation)
								]
							}),
						}),
						new MemSequence({
							children: [
								new GoToTarget(goToTargetKey),
								new PickupItem(requiredResourceKey),
								new GoToTarget(dropOffLocation),
								new AddResourceToRequirements(requiredResourceKey, requiredResources),
								new ClearBlackboardValue(requiredResourceKey)
							]
						})
					]
				}),
				new AllResourcesGathered(requiredResources)
			]
		});
	}
}