import {dropOffTargetKeyOrFunctionType} from '../../interfaces';
import {ResourceRequirements} from '../../resource-requirements';
import * as Core from '../core';

import * as Actions from './index';

const requiredResourceKey = 'required-resource';
const goToTargetKey = 'required-resource-go-to-target';

export class GatherResources extends Core.Sequence {
	constructor (
		requiredResources: ResourceRequirements,
		dropOffLocation: dropOffTargetKeyOrFunctionType
	) {
		super({
			children: [
				new Core.MemPriority({
					children: [
						new Core.Inverter({
							child: new Core.Sequence({
								children: [
									new Core.Inverter({
										child: new Actions.BlackboardValueExists(requiredResourceKey)
									}),
									new Actions.GetRequiredResource(requiredResourceKey, goToTargetKey, requiredResources, dropOffLocation)
								]
							}),
						}),
						new Core.MemSequence({
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