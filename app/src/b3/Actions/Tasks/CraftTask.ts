import * as Core from '../../Core';
import * as Actions from '../index';
import {assemblageData} from '../../../entity/assemblageData/items';
import {ResourceRequirements} from '../../../ResourceRequirements';
import {buildingUtil} from '../../../entity/util/building';
import {util} from '../../../util';
import {Item} from '../../../data/Item';

const craftBuildingKey = 'craft-building-key';

export class CraftTask extends Core.Sequence {
	constructor (
        item: Item,
        resourceRequirements: ResourceRequirements
    ) {
        const itemData = assemblageData[item];
        const getBuildingTile = tick => buildingUtil.getTileFromBuilding(
            util.blackboardGet(tick, craftBuildingKey)
        );

		super({
			children: [
				new Actions.GetNearestCraftBuilding(
                    craftBuildingKey,
                    itemData.craftable.profession
                ),
				new Actions.GatherResources(
                    resourceRequirements,
                    getBuildingTile
                ),
				new Actions.GoToTarget(getBuildingTile, 0),
				new Actions.CraftItem(
                    itemData.item.enum,
                    itemData.craftable.craftTurns,
                    getBuildingTile
                )
			]
		});
	}
}