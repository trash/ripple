import {b3} from '../index';
import * as Core from '../Core';

import {util} from '../../util';
import {positionUtil} from '../../entity/util/position';
import {Component} from '../../entity/ComponentEnum';

/**
 * An action to just make a citizen wait for a turn
 */
export class BuildingFromItem extends Core.BaseNode {
	itemTargetKey: string;
	buildingTargetKey: string;

	constructor (
        itemTargetKey: string,
        buildingTargetKey: string
    ) {
		super();
		this.itemTargetKey = itemTargetKey;
		this.buildingTargetKey = buildingTargetKey;
	}
	tick (tick: Core.Tick) {
		const item: number = util.blackboardGet(tick, this.itemTargetKey);

        const tile = positionUtil.getTileFromEntityId(item);
        const building = positionUtil.getEntitiesWithComponentInTile(
            tile,
            Component.Building
        )[0];

		util.blackboardSet(tick, this.buildingTargetKey, building);

		return b3.SUCCESS;
	}
}