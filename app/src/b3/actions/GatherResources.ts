import {dropOffTargetKeyOrFunctionType} from '../../interfaces';
import {ResourceRequirements} from '../../resource-requirements';
import {Sequence} from '../core/sequence';
import {MemPriority} from '../core/mem-priority';
import {MemSequence} from '../core/mem-sequence';
import {Inverter} from '../core/inverter';

import * as Actions from './index';

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
										child: new Actions.BlackboardValueExists(requiredResourceKey)
									}),
									new Actions.GetRequiredResource(requiredResourceKey, goToTargetKey, requiredResources, dropOffLocation)
								]
							}),
						}),
						new MemSequence({
							children: [
								new Actions.GoToTarget(goToTargetKey),
								new Actions.PickupItem(requiredResourceKey),
								new Actions.GoToTarget(dropOffLocation),
								new Actions.AddResourceToRequirements(requiredResourceKey, requiredResources),
								new Actions.ClearBlackboardValue(requiredResourceKey)
							]
						})
					]
				}),
				new Actions.AllResourcesGathered(requiredResources)
			]
		});
	}
}