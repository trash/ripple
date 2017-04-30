import * as Core from '../Core';
import * as Actions from './index';

import {dropOffTargetKeyOrFunctionType} from '../../interfaces';
import {ItemRequirements} from '../../ItemRequirements';

const requiredResourceKey = 'required-resource';
const goToTargetKey = 'required-resource-go-to-target';

export class GatherResources extends Core.Sequence {
	constructor (
		resourceRequirements: ItemRequirements,
		dropOffLocation: dropOffTargetKeyOrFunctionType
	) {
		super({
			children: [
				// The priority returns FAILURE when there are no more resources to collect
				new Core.Inverter({
					child: new Core.Priority({
						children: [
							new Core.Sequence({
								children: [
									new Actions.BlackboardValueExists(
										requiredResourceKey
									),
									new Core.MemSequence({
										children: [
											new Actions.GoToTarget(goToTargetKey),
											new Actions.PickupItem(requiredResourceKey),
											new Actions.GoToTarget(dropOffLocation),
											new Actions.AddResourceToRequirements(
												requiredResourceKey,
												resourceRequirements
											),
											new Actions.ClearBlackboardValue(requiredResourceKey)
										]
									})
								]
							}),
							new Core.Sequence({
								children: [
									new Core.Inverter({
										child: new Actions.BlackboardValueExists(
											requiredResourceKey
										)
									}),
									new Actions.GetRequiredResource(
										requiredResourceKey,
										goToTargetKey,
										resourceRequirements,
										dropOffLocation
									)
								]
							})
						]
					}),
				}),
				new Actions.AllResourcesGathered(resourceRequirements)
			]
		});
	}
}