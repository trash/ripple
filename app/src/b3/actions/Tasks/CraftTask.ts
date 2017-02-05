import * as Core from '../../Core';
import * as Actions from '../index';
import {assemblageData} from '../../../entity/assemblageData/items';
import {ResourceRequirements} from '../../../resource-requirements';

const craftBuildingKey = 'craft-building-key';

export class CraftTask extends Core.Sequence {
	constructor (
        item: string,
        resourceRequirements: ResourceRequirements
    ) {
        const itemData = assemblageData[item];

		super({
			children: [
				new Actions.GetNearestCraftBuilding(
                    craftBuildingKey,
                    itemData.craftable.profession
                ),
				new Actions.GatherResources(
                    resourceRequirements,
                    craftBuildingKey
                ),
				new Actions.GoToTarget(craftBuildingKey),
				new Actions.CraftItem(
                    itemData.item.name,
                    itemData.craftable.craftTurns,
                    craftBuildingKey
                )
			]
		});
	}
}