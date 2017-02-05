import {b3} from '../index';
import {util} from '../../util';
import * as Core from '../Core';
import {buildingUtil} from '../../entity/util';
import {IRowColumnCoordinates} from '../../interfaces';
import {Profession} from '../../data/profession';

/**
 * An action to just make a citizen wait for a turn
 */
export class GetNearestCraftBuilding extends Core.BaseNode {
	blackboardKey: string;
    profession: Profession;

	constructor (
        blackboardKey: string,
        profession: Profession
    ) {
		super();
		this.blackboardKey = blackboardKey;
        this.profession = profession;
	}

	tick (tick: Core.Tick) {
		const agentData = tick.target;
		const building = buildingUtil.getNearestBuildingByProfession(
            agentData.position.tile,
            this.profession
        );

		if (building) {
			util.blackboardSet(tick, this.blackboardKey, building);
			return b3.SUCCESS;
		}
		return b3.FAILURE;
	}
}