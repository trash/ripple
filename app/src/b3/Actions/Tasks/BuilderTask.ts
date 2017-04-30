import * as Core from '../../Core';
import {Task} from '../../../Tasks/Task';
import {ItemRequirements} from '../../../ItemRequirements';
import {IHealthState} from '../../../entity/components/health';
import {IRowColumnCoordinates} from '../../../interfaces';

import * as Actions from '../index';

export class BuilderTask extends Core.Sequence {
	constructor (
		buildingHealthState: IHealthState,
		requiredResources: ItemRequirements,
		entranceTile: IRowColumnCoordinates,
		task: Task
	) {
		super({
			children: [
				new Actions.GatherResources(requiredResources, () => entranceTile),
				new Actions.GoToTarget(() => entranceTile),
				new Actions.BuildBuilding(buildingHealthState, task),
			]
		});
	}
}